const canvas = document.getElementById('canvas1');
const stat = document.getElementById('statup');
const nnslider = document.getElementById('NNslider');
let lineCol =[255,0,0];
let limit = 100;
let tick = 0;
let numNodes=(window.innerWidth/3).toFixed(0);
let status = true;
const ctx = canvas.getContext("2d");
const framerate=60;
let gconst = 100;
function statupdate(){
    stat.innerHTML = `Force : ${limit} <br><br> No. nodes : ${numNodes} <br><br> color : ${lineCol[0]}, ${lineCol[1]}, ${lineCol[2]}`;
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
        ctx.linwidth = 5;
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
                this.connect(node,[lineCol[0],lineCol[1],lineCol[2],1.2-(dis/limit)]);
                node.x+=(this.x-node.x)/(Math.pow(this.radius,2)*dis);
                node.y+=(this.y-node.y)/(Math.pow(this.radius,2)*dis);
                // this.x-=(this.x-node.x)/(Math.pow(this.radius,2)*dis*gconst);
                // this.y-=(this.y-node.y)/(Math.pow(this.radius,2)*dis*gconst);
                
            }
            if (this.x > canvas.width+10 || this.x < -10) { this.x = getRandom(20, canvas.width - 10); }
                if (node.x > canvas.width+10 || node.x < -10) { node.x = getRandom(20, canvas.width - 10); }

                // Validate and fix Y coordinates
                if (this.y > canvas.height+10 || this.y < -10) { this.y = getRandom(20, canvas.height - 10); }
                if (node.y > canvas.height+10 || node.y < -10) { node.y = getRandom(20, canvas.height - 10); }
                // console.log(canvas.width,canvas.height);
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
        2,
        [0,255,0],
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
        // if(tick%10==1){limit++;}
        // if(tick%1500==1){limit=0}
        // console.log(tick,limit);
        // statupdate()
        // tick++;
        
    },1000/framerate);

function sliders(){
    
    let curno =  parseInt(nnslider.value, 10);
    console.log(curno);
    if(curno>numNodes){
        for(let i=0;i<curno-numNodes;i++){
            createNodes();
            
            statupdate();
        }

    }
    if(curno<numNodes){
        for(let i=0;i<numNodes-curno;i++){
            nodes.pop();
            statupdate();
        }

    }
    numNodes=curno;
}
window.addEventListener('resize', resize);
let k =0;
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
    if(e.key=="w"){
        lineCol=[getRandom(0,255),getRandom(0,255),getRandom(0,255)]   
    }
    if(e.key=="p"){
        
        k=!k;
        limit=(2000**k)+(0**(1-k))-1;
    }
    if(e.key=="["){
        if(gconst-50>0)
        gconst-=50;
    }
    if(e.key=="]"){
        gconst+=50;
    }
    
    statupdate();
})
