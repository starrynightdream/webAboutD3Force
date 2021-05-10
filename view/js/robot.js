/*
 * @Author: SND 
 * @Date: 2021-05-10 08:55:21 
 * @Last Modified by: SND
 * @Last Modified time: 2021-05-10 11:49:06
 */

Vue.component('talk-word', {
    props: ['talkdetail'],
    template:
    `
    <div :class="{myWord: talkdetail.isMyWord, robotWord: !talkdetail.isMyWord}">
        <span></span>
        <p>{{talkdetail.word}}</p>
    </div>
    `
});

window.onload = ()=>{

    let vueMain = new Vue({
        el: '#main',
        data: {
            width: 0,
            height: 0,
            sglobal: {},
            theQ :'',
            talkingRecode: [
                {'isMyWord': false, 'word': "ttestingtestingtestingtestingtesti123213123123n\nEgtestingtestingtestingesting", id:0},
                {'isMyWord': true, 'word': "testing", id:1},
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
            }
        },
        created: function () {
            // 初始化基础版面
            const _self = this;
            _self.width = window.innerWidth * 0.9;
            _self.height = window.innerHeight * 0.7;

            // bug：存在一个data的报错，请修正
        }
    });
}