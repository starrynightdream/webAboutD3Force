/*
 * @Author: SND 
 * @Date: 2021-05-05 22:47:32 
 * @Last Modified by: SND
 * @Last Modified time: 2021-05-13 11:59:29
 */

const testLinkData = [
    [
        {source: 1, sourceTypt: 'Disease', target: 2, targetType: 'Disease', reals: 'num', type: 'test'},
        {source: 1, sourceTypt: 'Disease', target: 3, targetType: 'Disease', reals: 'num', type: 'test'},
        {source: 1, sourceTypt: 'Disease', target: 4, targetType: 'Disease', reals: 'num', type: 'test'},
        {source: 1, sourceTypt: 'Disease', target: 5, targetType: 'Disease', reals: 'num', type: 'test'},
        {source: 1, sourceTypt: 'Disease', target: 6, targetType: 'Symptom', reals: 'num', type: 'test'},
        {source: 1, sourceTypt: 'Disease', target: 7, targetType: 'Disease', reals: 'num', type: 'test'},
        {source: 1, sourceTypt: 'Disease', target: 8, targetType: 'Disease', reals: 'num', type: 'test'},
        {source: 1, sourceTypt: 'Disease', target: 9, targetType: 'Disease', reals: 'num', type: 'test'},
        {source: 1, sourceTypt: 'Disease', target: 0, targetType: 'Disease', reals: 'num', type: 'test'},
    ],
    [
        {source: 0, sourceTypt: 'Disease', target: -1, targetType: 'Disease', reals: 'num', type: 'test'},
        {source: 0, sourceTypt: 'Disease', target: -2, targetType: 'Disease', reals: 'num', type: 'test'},
        {source: 0, sourceTypt: 'Disease', target: -3, targetType: 'Disease', reals: 'num', type: 'test'},
        {source: 0, sourceTypt: 'Disease', target: -4, targetType: 'Disease', reals: 'num', type: 'test'},
        {source: 0, sourceTypt: 'Disease', target: -5, targetType: 'Disease', reals: 'num', type: 'test'},
    ],
    [
        {source: 0, sourceTypt: 'Disease', target: 4, targetType: 'Disease', reals: 'num', type: 'test'},
        {source: 1, sourceTypt: 'Disease', target: 2, targetType: 'Disease', reals: 'num', type: 'test'},
        {source: 2, sourceTypt: 'Disease', target: 4, targetType: 'Disease', reals: 'num', type: 'test'},
    ]
]
const testDeatilData = [
    [{name: 0, detailText: 
    `
    test
    estt
    stte
    ttes
    1234
    2234
    3234
    4234
    1277
    2277
    7777
    `
    }]
]


// setting param
const cirR = 15;
const forceStreng = -800;
const showerColorA = d3.rgb(0, 0, 0);
const showerColorB = d3.rgb(255, 255, 255);
const showerColorF = d3.rgb(155, 155, 155);
const backgroundColor = d3.rgb(14, 0, 83);
const defaultKey = 12;
const showerSpeed = 800;
const robotSpeed = 5;

const RealObj = {
    'Disease' : '疾病',
    'Symptom' : '疾病症状',
    'Check' : '诊断项目',
    'Department' : '医疗科室',
    'Food' : '食物',
    'Drug' : '药品',
    'Prodducer' : '在售药品',
}
const PerDegInObjColor = 360 / Object.keys(RealObj).length;
const NameToColor = {};

Object.keys(RealObj).forEach((item, idx)=>{
    NameToColor[item] = d3.hsl(idx * PerDegInObjColor, 0.7, 0.5);
});

window.onload = () =>{

const main = new Vue({
    el: "#main",
    data: {
        width: 0,
        height: 0,
        sglobal : {},

        searchKey: "",

        showRobot: true,

    },
    methods:{
        /**
         * 逐步更新函数
         */
        tick: function() {
            // 每一帧更新小圆、线段与文字的位置信息
            this.sglobal.circle
                .attr('transform', this.transformCir);

            this.sglobal.link
                .attr('d', this.linkArc);

            this.sglobal.cirText
                .attr('x', d=>{return d.x;})
                .attr('y', d=>{return d.y;});
            
            this.sglobal.linkText
                .attr('x', d=>{return (d.source.x + d.target.x)/2;})
                .attr('y', d=>{return (d.source.y + d.target.y)/2;})
        },
        /**
         * 创建连接路径的函数
         */
        linkArc: (d) =>{
            const comm = `M ${d.source.x} ${d.source.y} L ${d.target.x} ${d.target.y}`;
            return comm;
        },
        /**
         * 对线段的文字每帧施加的位移
         */
        transformLinkText : (d) =>{},
        /**
         * 对园内的文字每帧施加的位移
         */
        transformCirText : (d) =>{},
        /**
         * 小圆位移 
         */
        transformCir : (d) =>{
            return `translate(${d.x}, ${d.y})`;
        },
        /**
         * 拖动开始的触发函数 
         */
        dragStart :  function (d){
            d.fixed = true;
        },
        /**
         * 拖动计算 
         */
        draged : function(event, d) {
            d.fx = event.x;
            d.fy = event.y;
            // 重启以适用新值， 否则会出现计算终止
            this.sglobal.force.alpha(0.1).restart();
        },
        // 机器人的点击事件
        clickRobot : function(){
            // TODO：对面板施加合适的CSS变化
            this.showRobot = !this.showRobot;
            if (this.showRobot){

                d3.select('.robotPlan')
                    .transition( d3.transition().duration(robotSpeed))
                    .style('height', '80vh')
                    .style('border', '2px soild');
            } else {

                d3.select('.robotPlan')
                    .transition( d3.transition().duration(robotSpeed))
                    .style('height', '0')
                    .style('border', 'none');
            }
        },
        // 线的绘制函数
        linkDraw :(_self, data, rootNode)=>{

            return rootNode.selectAll('path')
                .data(data)
                .enter()
                .append('path')
                .style("stroke-width",0.5)
                .attr("marker-end", "url(#resolved)" )
                .attr('d', (d) =>{return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y})
                .attr('class', 'edgePath')
                .attr('id', (d, i)=>{return 'edgepath'+i;});
        },
        // 圆的绘制函数
        cirDraw : (_self, data, rootNode)=>{

            return rootNode.selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                .attr('r', cirR)
                .style('fill', node=>{
                    return NameToColor[node.cType];
                })
                .style('pointer-events', 'visible')
                .on('click', function(node, d) {
                    // TODO: click event 添加新节点
                    _self.getData(d.name, false);
                    d.fixed = true;
                })
                .on('dblclick', function (e, d) {
                    // TODO: click event 如果有则显示细节信息,并且需要兼顾文字长度
                    // 并且只有自己有细节信息的情况才需要点击事件
                    if (d.detailText){
                        // TODO: 设定细节文本
                        d.fixed = true;
                        _self.intoDetail(d.detailText.split('\n'));
                    }
                })
                .call(_self.sglobal.drag);
        },
        // 线段文字的绘制函数
        linkTextDraw : (_self, data, rootNode) =>{

            return rootNode.selectAll('text')
                .data(data)
                .enter()
                .append('text')
                .attr('x', d=>{return (d.source.x + d.target.x)/2;})
                .attr('y', d=>{return (d.source.y + d.target.y)/2;})
                .style('fill', 'rgb(255, 255, 255)')
                .text(d=>{return d.reals;})
        },
        // 圆内文字的绘制函数
        cirTextDraw : (_self, data, rootNode) =>{

            return rootNode.selectAll('text')
                .data(data)
                .enter()
                .append('text')
                .attr('x', d=>{return d.x;})
                .attr('y', d=>{return d.y;})
                .style('fill', 'rgb(255, 255, 255)')
                .text(d=>{return d.name;})
        },
        // 较为复杂的版面绘制
        showerDraw : (_self, root) =>{

            let makeR = root.append('g')
                .attr('id', 'showerG');
                
            // TODO: 更丰富的变化基础
            let dataNC = _self.sglobal.dataNC;
            let dataC = _self.sglobal.dataC;

            makeR.append('g')
                .attr('id', 'showerNCG')
                .selectAll('rect')
                .data(dataNC)
                .enter()
                .append('rect')
                .attr('id', (d)=>{return d.id;})
                .attr('x', (d)=>{return d.x})
                .attr('y', (d)=>{return d.y})
                .attr('width', (d)=>{return d.width;})
                .attr('height', (d)=>{return d.height;})
                .attr('fill', (d)=>{return d.fill;})
                .on('click', ()=>{
                    _self.outDeatil();
                });
            
            makeR.append('g')
                .attr('id', 'showerCG')
                .selectAll('rect')
                .data(dataC)
                .enter()
                .append('rect')
                .attr('id', (d)=>{return d.id;})
                .attr('x', (d)=>{return d.x})
                .attr('y', (d)=>{return d.y})
                .attr('width', (d)=>{return d.width;})
                .attr('height', (d)=>{return d.height;})
                .attr('fill', (d)=>{return d.fill;})
                .on('click', ()=>{
                    _self.outDeatil();
                });

            return makeR;
        },
        // 详细页面的进入逻辑
        intoDetail : function (texts) {
            // TODO: 添加动态效果以及文字的显示的效果修正
            const _self = this;
            let dataNC = _self.sglobal.dataNC;
            let dataC = _self.sglobal.dataC;

            this.sglobal.shower.select('#showerNCG')
                .selectAll('rect')
                .data(dataNC)
                .transition( d3.transition().duration(showerSpeed))
                .attr('fill' , d=>{return d.toFill;})
                .attr('x' , d=>{return d.toX;})
                .attr('width' , d=>{return d.toWidth;})

            this.sglobal.shower.select('#showerCG')
                .selectAll('rect')
                .data(dataC)
                .transition( d3.transition().duration(showerSpeed))
                .attr('fill' , d=>{return d.toFill;})
                .attr('x' , d=>{return d.toX;})
                .attr('width' , d=>{return d.toWidth;})

            // 字体设置
            let text = this.sglobal.shower.append('text')
                .attr('fill', d3.rgb(100,100,100))
                .attr('fill', d3.rgb(0,0,0))
                .attr('x', '10vw')
                .attr('y', '10vh');

            text.selectAll('tspan')
                .data(texts)
                .enter()
                .append('tspan')
                .html(d=>{return d})
                .attr('x', '10vw')
                .attr('dy', '1em')
                .attr('fill', backgroundColor)
                .transition( d3.transition().duration(800))
                .attr('fill', 'white')

        },
        // 详细页面的离开逻辑
        outDeatil : function () {
            // TODO: 根据进入修正离开的逻辑
            const _self = this;
            let dataNC = _self.sglobal.dataNC;
            let dataC = _self.sglobal.dataC;

            
            this.sglobal.shower.select('#showerNCG')
                .selectAll('rect')
                .data(dataNC)
                .transition( d3.transition().duration(showerSpeed))
                .attr('fill' , d=>{return d.fill;})
                .attr('x' , d=>{return d.x;})
                .attr('width' , d=>{return d.width;})

            this.sglobal.shower.select('#showerCG')
                .selectAll('rect')
                .data(dataC)
                .transition( d3.transition().duration(showerSpeed))
                .attr('fill' , d=>{return d.fill;})
                .attr('x' , d=>{return d.x;})
                .attr('width' , d=>{return d.width;})

            this.sglobal.shower.select('text').remove();
        },

        createSample : function(){
            const d = document.createElement('div');
            d.className = 'pcShower';
            d.width = window.innerWidth * 0.1;
            d.height = window.innerHeight * 0.01 * Object.keys(RealObj).length;
            
            const fomtStr = 
            `
            <div style="display: flex; display: -webkit-flex; align-items: center; justify-items: center;">
                <div style="width: 1vh; height: 1vh; background-color: #color#;"></div>
                <span> - </span>
                <span>#word#</span>
            </div>
            `;

            let inner = '';


            Object.keys(RealObj).forEach(item =>{
                inner += fomtStr.replace('#color#', NameToColor[item]).replace('#word#', RealObj[item]);
            });

            d.innerHTML = inner;
            document.getElementsByTagName('body')[0].append(d);
        },

        /**
         * 根据key查找数据并更新
         * @param {string} key 查找的键值
         */
        getData : function (key, needClear){
            const _self = this;
            if (needClear){
                _self.sglobal.nodes = {};
                _self.sglobal.edges = [];
            }

            // TODO: 从后台获取数据
            let data = testLinkData[key % testLinkData.length];
            let detail = testDeatilData[key % testDeatilData.length];

            // 对所有获取的数据
            data.forEach((item) =>{
                const newData = {};
                newData.source = _self.sglobal.nodes[ item.source] || (_self.sglobal.nodes[ item.source] = {name: item.source});
                newData.target = _self.sglobal.nodes[ item.target] || (_self.sglobal.nodes[ item.target] = {name: item.target});
                _self.sglobal.nodes[ item.source].cType = item.sourceTypt;
                _self.sglobal.nodes[ item.target].cType = item.targetType;
                newData.reals = item.reals;
                _self.sglobal.edges.push(newData);
            });

            detail.forEach( item =>{
                if (!_self.sglobal.nodes[item.name])  
                    _self.sglobal.nodes[ item.name] = {name: item.name};
                _self.sglobal.nodes[item.name].detailText = item.detailText;
            });

            if (needClear && _self.sglobal.force){
                _self.reDraw();
            } else if (_self.sglobal.force) {
                _self.addNode();
            }
            
        },
        addNode: function() {
            const _self = this;
            const svg = _self.sglobal.svg;
            const force = _self.sglobal.force;

            force.nodes( Object.values(_self.sglobal.nodes));
            force.force('link').links(_self.sglobal.edges);
            force.alpha(0.1).restart();

            // 重新更具各个数据绘制
            
            _self.linkDraw(_self, _self.sglobal.edges, svg.select('#linkG'));
            _self.sglobal.link = svg.selectAll('.edgePath');


            _self.cirDraw(_self, Object.values(_self.sglobal.nodes), svg.select('#circleG'));
            _self.sglobal.circle = svg.select('#circleG').selectAll('circle');


            _self.linkTextDraw(_self, _self.sglobal.edges, svg.select('#linkTextG'));
            _self.sglobal.linkText = svg.select('#linkTextG').selectAll('text');
            

            _self.cirTextDraw(_self, Object.values( _self.sglobal.nodes), svg.select('#cirTextG'));
            _self.sglobal.cirText = svg.select('#cirTextG').selectAll('text');
        },

        /**
         * 重新绘制界面
         */
        reDraw: function (){
            const _self = this;
            const svg = _self.sglobal.svg;
            svg.selectAll('g').remove();

            const force = d3.forceSimulation( Object.values( _self.sglobal.nodes))
                .force('link', d3.forceLink(_self.sglobal.edges).distance(cirR * 8))
                .force('charge', d3.forceManyBody().strength(forceStreng))
                .force('center', d3.forceCenter(_self.width/2, _self.height/2))
                .on('tick', _self.tick);

            _self.sglobal.force = force;
        
            const drag = 
                d3.drag()
                    .on('start', _self.dragStart)
                    .on('drag', _self.draged)
                    .on('end', null);
           
            _self.sglobal.drag = drag;

            // 线
            const link = _self.linkDraw(_self, _self.sglobal.edges, 
                svg.append('g').attr('id', 'linkG').attr('class', 'transitionAble'));

            _self.sglobal.link = link;

            // 点
            const circle = _self.cirDraw(_self, Object.values( _self.sglobal.nodes), 
                svg.append('g').attr('id', 'circleG').attr('class', 'transitionAble'));

            _self.sglobal.circle = circle;

            const linkText = _self.linkTextDraw(_self, _self.sglobal.edges, 
                svg.append('g').attr('id', 'linkTextG').attr('class', 'transitionAble'));
            _self.sglobal.linkText = linkText;

            const cirText = _self.cirTextDraw(_self, Object.values( _self.sglobal.nodes), 
                svg.append('g').attr('id', 'cirTextG').attr('class', 'transitionAble'));
            _self.sglobal.cirText = cirText;

            // 重新绘制shower使得shower在所有物件之上
            const shower = _self.showerDraw(_self, svg);
            _self.sglobal.shower = shower;
        }
    },
    mounted: function() {
        const _self = this;
        // 获取宽高
        _self.width = window.innerWidth * 0.9;
        _self.height = window.innerHeight * 0.6;
        d3.select('body')
            .style('background-color', backgroundColor);

        d3.select('#Title')
            .transition( d3.transition().duration(500))
            .attr('class', 'titleAfter');

        // 非遮罩部分数据
        const dataNC = [
            {
                height: _self.height/2 -5, 
                width: 0,
                toWidth: _self.width -10,
                x: _self.width - 5,
                toX: 5,
                y: 5,
                fill: showerColorB,
                toFill: showerColorA,
                id: 'infoShowerNC1',
            },
            {
                height: _self.height/2 -5, 
                width: 0,
                toWidth: _self.width -10,
                x: 5,
                toX: 5,
                y: _self.height/2,
                fill: showerColorB,
                toFill: showerColorA,
                id: 'infoShowerNC2',
            },
        ];

        // 遮罩部分数据
        const dataC = [
            {
                height: _self.height/2 -9, 
                width: 0,
                toWidth: _self.width - 20,
                x: 10,
                toX: 10,
                y: 10,
                fill: showerColorF,
                toFill: showerColorB,
                id: 'infoShowerC1',
            },
            {
                height: _self.height/2 -9, 
                width: 0,
                toWidth: _self.width - 20,
                x: _self.width-10,
                toX: 10,
                y: _self.height/2,
                fill: showerColorF,
                toFill: showerColorB,
                id: 'infoShowerC2',
            },
        ];
        _self.sglobal.dataNC = dataNC;
        _self.sglobal.dataC = dataC;

        // 获取默认数据
        let urlKeys = window.location.href.split('?');
        let willSearchKey= defaultKey;

        // 进行url参数的解释
        if (urlKeys.length > 1){
            urlKeys = urlKeys[1].split('&');
            for (item of urlKeys){
                t = item.split('=');
                if (t[0] == 'key'){
                    willSearchKey = t[1];
                }
            }
        }
        _self.getData(willSearchKey, true);

        // 创建svg 版面
        const svg = d3.select('#drawPath').append('svg')
            .attr('width', _self.width)
            .attr('height', _self.height)
            .call(d3.zoom()
                .on('zoom', (event) => {
                    svg.selectAll('.transitionAble')
                    .attr('transform', event.transform);
               })
            )
            .on('dblclick.zoom', null);
 
        // 通用箭头遮罩
        svg.append('marker')
            .attr('id', 'resolved')
            .attr("markerUnits","userSpaceOnUse")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX",32)
            .attr("refY", -1)
            .attr("markerWidth", cirR /2)
            .attr("markerHeight", cirR /2)
            .attr("orient", "auto")
            .attr("stroke-width",2)
            .append("path")
            .attr("d", "M 0,-5 L 10,0 L 0,5")
            .attr('fill','#000000');
        

        // TODO 初始化位置信息，最好有一个较好的初始位置
        for (let key in _self.sglobal.nodes) {
            _self.sglobal.nodes[key].x = _self.width / 2;
            _self.sglobal.nodes[key].y = _self.height / 2;
        }

        _self.sglobal.svg = svg;

        _self.reDraw();
        _self.clickRobot();
        
        _self.createSample();
    },
});

} // end window onload