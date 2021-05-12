/*
 * @Author: SND 
 * @Date: 2021-05-10 08:55:21 
 * @Last Modified by: SND
 * @Last Modified time: 2021-05-12 22:24:56
 */

// setting
const DefaultQ = {
    "des": '名称'
}

// UPPER: 也许写成局部组件会更加安全？
Vue.component('talk-word', {
    props: ['talkdetail'],
    template:
    `
    <div :class="{myWord: talkdetail.isMyWord, robotWord: !talkdetail.isMyWord}">
        <span></span>
        <p>
        <span>{{talkdetail.word}}</span>
        <link-item v-for="d in talkdetail.detailL" 
            :e="getDetail" :porp="d" :word="talkdetail.dname + ' 的 ' + DefaultQ[d]">
        </link-item>
        <link-item v-for="k in talkdetail.keyWordL" 
            :e="createKeyWordSearch" :porp="k" :word="k">
        </link-item>
        </p>
    </div>
    `,
    components: {
        'link-item': {
            props: ['e','porp','word'],
            template:
            `
            <div>
                <a @click="e(porp)">{{word}}</a>
            </div>
            `
        }
    },
    methods:{
        // UPPER: 这里使用的全局形式并不是最安全的写法
        getDetail: function (p) {
            // TODO: 向端口请求具体数据，此处是查询对应详细属性
            vueMain.addWordToShow('TheFindAns about ' + p, false);
            vueMain.toTalkEnd();
        },
        // 创建一个包含具体病名的查询对话
        createKeyWordSearch: function(p) {
            vueMain.addDeatilToShow(Object.keys(DefaultQ), false, p);
            vueMain.toTalkEnd();
        }
    }
});

window.onload = ()=>{

    vueMain = new Vue({
        el: '#main',
        data: {
            width: 0,
            height: 0,
            sglobal: {},
            theQ :'',
            talkingRecode: [
                {
                    isMyWord: false, word: "欢迎访问机器人",
                    id:0
                },
            ]
        },
        methods: {
            // TODO: 为对话添加的时候添加一个合适的过度
            sendAsk: function(word){
                const _self = this;
                _self.addWordToShow(word, true);
                _self.toTalkEnd();

                _self.getDataFromPort(word);
                _self.toTalkEnd();
            },
            // 将一句话添加到展示中
            addWordToShow: function(word, isMyWord){
                const _self = this;
                _self.talkingRecode.push({
                    isMyWord, word, 'id': _self.talkingRecode.slice(-1)[0].id +1
                });
            },
            // 将一个具有详细展示的信息添加到界面中
            addDeatilToShow: function(L, isKeyWordList, dname) {
                const _self = this;
                let isMyWord = false;
                let word = '';
                let id = _self.talkingRecode[ vueMain.talkingRecode.length-1] +1;
                let detailL = []; let keyWordL = [];

                if (isKeyWordList){
                    word = '您是否在找';
                    keyWordL = L;
                }else{
                    word = `对于${dname}, 您可以向下查找:\n`
                    detailL = L;
                }

                _self.talkingRecode.push({
                    isMyWord, word, dname, detailL, keyWordL, id
                });
            },
            // 滚动至底部
            toTalkEnd: ()=>{
                const end = document.getElementById('talkend');
                let behavior = 'smooth';
                end.scrollIntoView({
                    behavior
                });
            },

            getDataFromPort: function(word) {
                // TODO: 替换为真正的请求数据，此处应当获取问题的可能键值
                this.addDeatilToShow(['A', 'B'], true);
                // this.addWordToShow(`对于${["C", "D"].join(', ')}未提供查询支持，请到隔壁知识图谱一看究竟吧.`);
            },
        },
        created: function () {
            // 初始化基础版面
            const _self = this;
            _self.width = window.innerWidth * 0.9;
            _self.height = window.innerHeight * 0.7;
        }
    });
}