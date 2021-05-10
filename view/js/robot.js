/*
 * @Author: SND 
 * @Date: 2021-05-10 08:55:21 
 * @Last Modified by: SND
 * @Last Modified time: 2021-05-10 23:00:14
 */

const gDataList = [
    'diss', 'recove', 'cure_time'
]

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
            :e="getDetail" :porp="d" :word="d">
        </link-item>
        <link-item v-for="k in talkdetail.keyWordL" 
            :e="getKeyWord" :porp="k" :word="k">
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
            // TODO: 向端口请求具体数据
            vueMain.addWordToShow('TheFindAns', false);
            vueMain.toTalkEnd();
        },
        getKeyWord: function(p) {
            // TODO: 向端口请求具体数据
            vueMain.talkingRecode.push({
                word:`对于${p}, 您可以向下查找:\n`, isMyWord:false,
                dname: p,
                detailL: gDataList ,
                id : vueMain.talkingRecode[ vueMain.talkingRecode.length-1] +1,
            });
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
                {
                    'isMyWord': true, 'word': "AB", id:1, 
                },
                {
                    isMyWord: false,word:"您是否在找：\n", id:2, 
                    keyWordL:["A", "B"], 
                }
            ]
        },
        methods: {
            sendAsk: function(word){
                const _self = this;
                _self.addWordToShow(word, true);
                _self.toTalkEnd();

                let data = _self.getDataFromPort(word);
                this.addWordToShow(data);
                _self.toTalkEnd();
            },
            // 将一句话添加到展示中
            addWordToShow: function(word, isMyWord){
                const _self = this;
                _self.talkingRecode.push({
                    isMyWord, word, 'id': _self.talkingRecode.slice(-1)[0].id +1
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

            getDataFromPort: (word) =>{
                // TODO: 替换为真正的请求数据
                for (let i=0; i<3; i++)
                    word += word;
                return word;
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