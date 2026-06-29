const canvas = document.getElementById('canvas1');
const stat = document.getElementById('statup');
let limit = 200;
let numNodes=30;
let status = true;
const ctx = canvas.getContext("2d");
const framerate=60;

function statupdate(){
    stat.innerHTML = `Min-length : ${limit} <br><br> No. nodes : ${numNodes}`
}

function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    
}
statupdate()
resize();

class node{
    constructor(x,y,radius,color,speedx,speedy,fadesize=2){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.speedx=speedx;
        this.speedy=speedy;
        this.color=color;
        this.fadesize = fadesize;
    }

    connect(node,color){
        ctx.beginPath();
        ctx.moveTo(this.x,this.y);
        ctx.lineTo(node.x,node.y);
        ctx.strokeStyle= `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
        ctx.linwidth = 2;
        ctx.stroke();
    }

    update(){
        this.x+=this.speedx;
        this.y+=this.speedy;
        if(this.x>=canvas.width || this.x<=0){this.speedx=-this.speedx}
        if(this.y>=canvas.height || this.y<=0){this.speedy=-this.speedy}
    }

    draw(nodes){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius*this.fadesize,0,Math.PI*2);
        ctx.fillStyle = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},0.3)`
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.fillStyle = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},1.0)`
        ctx.fill();
        if(nodes!==undefined){
            nodes.forEach((node)=>{
                let dis=Math.sqrt(Math.pow((this.x-node.x),2)+Math.pow((this.y-node.y),2));
            if(dis<limit && dis>0){
                // this.connect(node,[255,255,255,1.2-(dis/limit)]);
                node.x+=(this.x-node.x)/100*this.radius;
                node.y+=(this.y-node.y)/100*this.radius;
            }
        });
        }
        this.update();
    }

}

// let node1 = new node(canvas.width/2,canvas.height/2,4,[0,255,0],0,0,7);

let nodes = [];
// nodes.push(node1);


for(let i=0;i<numNodes;i++){
    createNodes();
} 

function createNodes(){
    let temp = new node(
        getRandom(20,canvas.width-10),
        getRandom(20,canvas.height-10),
        getRandom(1,7),
        [getRandom(0,255),getRandom(0,255),getRandom(0,255)],
        getRandom(-3,3),
        getRandom(-3,3),
        3);

    nodes.push(temp);

}

function getRandom(min=0,max){
    return Number((Math.random()*(max-min)+min).toFixed(2));
}

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let index=0;index<nodes.length;index++){
        nodes[index].draw(nodes.slice(index,nodes.length))
    }
}


setInterval(()=>{
        if(status){animate();}
        
    },1000/framerate);
window.addEventListener('resize', resize);
window.addEventListener('keydown',(e)=>{
    if(numNodes>10 && e.key=='ArrowDown'){
        numNodes-=10;
        for(let i=0;i<10;i++){
            nodes.pop();
        }
        
    }
    if(e.key=="ArrowUp"){
        numNodes+=10;
        for(let i=0;i<10;i++){
            createNodes();
        }        
    }

    if(e.key=="ArrowLeft" && limit>0){
        limit-=10;   
    }

    if(e.key=="ArrowRight"){
        limit+=10;   
    }

    if(e.key==" "){
        status=!status;
    }
    statupdate();
})
