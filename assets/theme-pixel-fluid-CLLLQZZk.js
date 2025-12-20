import{B as k}from"./theme-ocean-Df1BHeqo.js";import"./vendor-three-C29NQ9Z3.js";class P{static imageCache=new Map;constructor(t,i){this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d",{willReadFrequently:!0}),this.width=t,this.height=i,this.imageData=null,this.currentText="HELLO",this.currentOptions={},this.resize(t,i)}resize(t,i){this.width=t,this.height=i,this.canvas.width=t,this.canvas.height=i,this.generateField(this.currentText,this.currentOptions)}generateField(t="HELLO",i={}){this.currentText=t,this.currentOptions=i;const e=this.ctx,s=i.fontSize!=null?i.fontSize:Math.min(this.width,this.height)*1.3/t.length,n=i.fontFamily??"Arial",r=i.fontWeight??"bold",o=i.blur??15;e.fillStyle="black",e.fillRect(0,0,this.width,this.height),e.fillStyle="white",e.font=`${r} ${s}px ${n}`,e.textAlign="center",e.textBaseline="middle",e.fillText(t,this.width/2,this.height/2),o>0&&(e.filter=`blur(${o}px)`,e.drawImage(this.canvas,0,0),e.filter="none"),this.imageData=e.getImageData(0,0,this.width,this.height)}getBrightness(t,i){const e=Math.floor(t),s=Math.floor(i);if(e<0||e>=this.width||s<0||s>=this.height)return 0;const n=(s*this.width+e)*4;return this.imageData.data[n]/255}getForceAt(t,i,e=.3){const n=this.getBrightness(t+5,i),r=this.getBrightness(t-5,i),o=this.getBrightness(t,i+5),h=this.getBrightness(t,i-5),g=(n-r)/(2*5),l=(o-h)/(2*5);return{fx:g*e,fy:l*e}}async _loadImage(t){return P.imageCache.has(t)?P.imageCache.get(t):new Promise((i,e)=>{const s=new Image;s.onload=()=>{P.imageCache.set(t,s),i(s)},s.onerror=()=>{e(new Error(`Failed to load image: ${t}`))},s.src=t})}async generateFieldFromImage(t,i={}){try{const{fit:e="contain",scale:s=1,threshold:n=128,invert:r=!1,blur:o=15}=i,h=await this._loadImage(t),g=this.ctx;g.fillStyle="black",g.fillRect(0,0,this.width,this.height);let l,c,f,a;const d=h.width/h.height,u=this.width/this.height;if(e==="contain"?d>u?(f=this.width,a=this.width/d,l=0,c=(this.height-a)/2):(a=this.height,f=this.height*d,c=0,l=(this.width-f)/2):e==="cover"?d>u?(a=this.height,f=this.height*d,c=0,l=(this.width-f)/2):(f=this.width,a=this.width/d,l=0,c=(this.height-a)/2):(l=0,c=0,f=this.width,a=this.height),s!==1){const y=f*s,v=a*s,x=(f-y)/2,w=(a-v)/2;l+=x,c+=w,f=y,a=v}g.drawImage(h,l,c,f,a);let p=g.getImageData(0,0,this.width,this.height);const m=p.data;for(let y=0;y<m.length;y+=4){const x=(m[y]+m[y+1]+m[y+2])/3>n?255:0,w=r?255-x:x;m[y]=w,m[y+1]=w,m[y+2]=w}g.putImageData(p,0,0),o>0&&(g.filter=`blur(${o}px)`,g.drawImage(this.canvas,0,0),g.filter="none"),this.imageData=g.getImageData(0,0,this.width,this.height)}catch(e){throw console.error("Error generating field from image:",e),e}}async generateFieldFromSVG(t,i={}){return new Promise((e,s)=>{const{scale:n=1,blur:r=15}=i;t.trim().startsWith("<svg")?(this._renderSVG(t,n,r),e()):fetch(t).then(h=>{if(!h.ok)throw new Error(`HTTP error! status: ${h.status}`);return h.text()}).then(h=>{this._renderSVG(h,n,r),e()}).catch(h=>{s(new Error(`Failed to load SVG: ${h.message}`))})})}_renderSVG(t,i,e){const s=this.ctx,n=new Image,r=new Blob([t],{type:"image/svg+xml;charset=utf-8"}),o=URL.createObjectURL(r);n.onload=()=>{s.fillStyle="black",s.fillRect(0,0,this.width,this.height);const h=n.width*i,g=n.height*i,l=(this.width-h)/2,c=(this.height-g)/2;s.drawImage(n,l,c,h,g);let f=s.getImageData(0,0,this.width,this.height);const a=f.data;for(let d=0;d<a.length;d+=4){const u=(a[d]+a[d+1]+a[d+2])/3;a[d]=a[d+1]=a[d+2]=u>128?255:0}s.putImageData(f,0,0),e>0&&(s.filter=`blur(${e}px)`,s.drawImage(this.canvas,0,0),s.filter="none"),this.imageData=s.getImageData(0,0,this.width,this.height),URL.revokeObjectURL(o)},n.src=o}debugDraw(t){t.save(),t.globalAlpha=.3,t.drawImage(this.canvas,0,0),t.restore()}getCanvas(){return this.canvas}}class E{constructor(t,i,e){this.width=t,this.height=i,this.gridSize=e,this.gridCols=Math.ceil(t/e),this.gridRows=Math.ceil(i/e);const s=this.gridCols*this.gridRows;this.density=new Float32Array(s),this.densityPrev=new Float32Array(s),this.velocityX=new Float32Array(s),this.velocityY=new Float32Array(s),this.velocityXPrev=new Float32Array(s),this.velocityYPrev=new Float32Array(s),this.capacityField=new Float32Array(s),this.viscosity=1e-4,this.diffusion=1e-4,this.forceMultiplier=50,this.velocityDissipation=.99,this.densityDissipation=.995,this.iterations=4,console.log(`FluidSimulation initialized: ${this.gridCols} × ${this.gridRows} = ${s} cells`)}getIndex(t,i){return i*this.gridCols+t}isValid(t,i){return t>=0&&t<this.gridCols&&i>=0&&i<this.gridRows}initializeDensity(t){for(let i=0;i<this.density.length;i++)this.density[i]=0}updateCapacityField(t,i,e){for(let s=0;s<this.gridRows;s++)for(let n=0;n<this.gridCols;n++){const r=(n+.5)*this.gridSize,o=(s+.5)*this.gridSize,h=t.getBrightness(r,o),g=this.getIndex(n,s);this.capacityField[g]=i+h*e}}addVelocity(t,i,e,s){if(!this.isValid(t,i))return;const n=this.getIndex(t,i);this.velocityX[n]+=e*this.forceMultiplier,this.velocityY[n]+=s*this.forceMultiplier}addDensity(t,i,e){if(!this.isValid(t,i))return;const s=this.getIndex(t,i);this.density[s]+=e}lerp(t,i,e){return t+(i-t)*e}bilinearSample(t,i,e){i=Math.max(.5,Math.min(this.gridCols-1.5,i)),e=Math.max(.5,Math.min(this.gridRows-1.5,e));const s=Math.floor(i),n=Math.floor(e),r=s+1,o=n+1,h=i-s,g=e-n,l=this.getIndex(s,n),c=this.getIndex(r,n),f=this.getIndex(s,o),a=this.getIndex(r,o),d=this.lerp(t[l],t[c],h),u=this.lerp(t[f],t[a],h);return this.lerp(d,u,g)}setBoundary(t,i){const e=this.gridCols,s=this.gridRows;for(let n=1;n<s-1;n++)i[this.getIndex(0,n)]=t===1?-i[this.getIndex(1,n)]:i[this.getIndex(1,n)],i[this.getIndex(e-1,n)]=t===1?-i[this.getIndex(e-2,n)]:i[this.getIndex(e-2,n)];for(let n=1;n<e-1;n++)i[this.getIndex(n,0)]=t===2?-i[this.getIndex(n,1)]:i[this.getIndex(n,1)],i[this.getIndex(n,s-1)]=t===2?-i[this.getIndex(n,s-2)]:i[this.getIndex(n,s-2)];i[this.getIndex(0,0)]=.5*(i[this.getIndex(1,0)]+i[this.getIndex(0,1)]),i[this.getIndex(0,s-1)]=.5*(i[this.getIndex(1,s-1)]+i[this.getIndex(0,s-2)]),i[this.getIndex(e-1,0)]=.5*(i[this.getIndex(e-2,0)]+i[this.getIndex(e-1,1)]),i[this.getIndex(e-1,s-1)]=.5*(i[this.getIndex(e-2,s-1)]+i[this.getIndex(e-1,s-2)])}linearSolve(t,i,e,s,n){const r=1/n;for(let o=0;o<this.iterations;o++){for(let h=1;h<this.gridRows-1;h++)for(let g=1;g<this.gridCols-1;g++){const l=this.getIndex(g,h),c=i[this.getIndex(g-1,h)]+i[this.getIndex(g+1,h)]+i[this.getIndex(g,h-1)]+i[this.getIndex(g,h+1)];i[l]=(e[l]+s*c)*r}this.setBoundary(t,i)}}diffuse(t,i,e,s,n){const r=n*s*(this.gridCols-2)*(this.gridRows-2);this.linearSolve(t,i,e,r,1+4*r)}project(){const t=1/Math.max(this.gridCols,this.gridRows),i=new Float32Array(this.gridCols*this.gridRows),e=new Float32Array(this.gridCols*this.gridRows);for(let s=1;s<this.gridRows-1;s++)for(let n=1;n<this.gridCols-1;n++){const r=this.getIndex(n,s);i[r]=-.5*t*(this.velocityX[this.getIndex(n+1,s)]-this.velocityX[this.getIndex(n-1,s)]+this.velocityY[this.getIndex(n,s+1)]-this.velocityY[this.getIndex(n,s-1)]),e[r]=0}this.setBoundary(0,i),this.setBoundary(0,e),this.linearSolve(0,e,i,1,4);for(let s=1;s<this.gridRows-1;s++)for(let n=1;n<this.gridCols-1;n++){const r=this.getIndex(n,s);this.velocityX[r]-=.5*(e[this.getIndex(n+1,s)]-e[this.getIndex(n-1,s)])/t,this.velocityY[r]-=.5*(e[this.getIndex(n,s+1)]-e[this.getIndex(n,s-1)])/t}this.setBoundary(1,this.velocityX),this.setBoundary(2,this.velocityY)}advect(t,i,e,s,n,r){for(let h=1;h<this.gridRows-1;h++)for(let g=1;g<this.gridCols-1;g++){const l=this.getIndex(g,h);let c=g-1*s[l],f=h-1*n[l];i[l]=this.bilinearSample(e,c,f)}this.setBoundary(t,i)}applyCapacityField(t,i=50,e=.5){for(let s=1;s<this.gridRows-1;s++)for(let n=1;n<this.gridCols-1;n++){const r=this.getIndex(n,s),o=this.capacityField[r];if(o>1){const l=(o-1)*e;this.density[r]+=l}const h=(this.capacityField[this.getIndex(n+1,s)]-this.capacityField[this.getIndex(n-1,s)])*.5,g=(this.capacityField[this.getIndex(n,s+1)]-this.capacityField[this.getIndex(n,s-1)])*.5;this.velocityX[r]+=h*i*t,this.velocityY[r]+=g*i*t}}step(t){[this.velocityX,this.velocityXPrev]=[this.velocityXPrev,this.velocityX],[this.velocityY,this.velocityYPrev]=[this.velocityYPrev,this.velocityY],this.diffuse(1,this.velocityX,this.velocityXPrev,this.viscosity,t),this.diffuse(2,this.velocityY,this.velocityYPrev,this.viscosity,t),this.project(),[this.velocityX,this.velocityXPrev]=[this.velocityXPrev,this.velocityX],[this.velocityY,this.velocityYPrev]=[this.velocityYPrev,this.velocityY],this.advect(1,this.velocityX,this.velocityXPrev,this.velocityXPrev,this.velocityYPrev,t),this.advect(2,this.velocityY,this.velocityYPrev,this.velocityXPrev,this.velocityYPrev,t),this.project(),[this.density,this.densityPrev]=[this.densityPrev,this.density],this.diffuse(0,this.density,this.densityPrev,this.diffusion,t),[this.density,this.densityPrev]=[this.densityPrev,this.density],this.advect(0,this.density,this.densityPrev,this.velocityX,this.velocityY,t),this.applyCapacityField(t,0,1);for(let i=0;i<this.density.length;i++)this.velocityX[i]*=this.velocityDissipation,this.velocityY[i]*=this.velocityDissipation,this.density[i]*=this.densityDissipation}getDensityGrid(){return this.density}getGridInfo(){return{cols:this.gridCols,rows:this.gridRows,size:this.gridSize}}resize(t,i){const e=Math.ceil(t/this.gridSize),s=Math.ceil(i/this.gridSize);if(e===this.gridCols&&s===this.gridRows){this.width=t,this.height=i;return}console.log(`FluidSimulation resizing: ${this.gridCols}×${this.gridRows} → ${e}×${s}`);const n=e*s,r=this.density,o=this.velocityX,h=this.velocityY,g=this.gridCols,l=this.gridRows;this.width=t,this.height=i,this.gridCols=e,this.gridRows=s,this.density=new Float32Array(n),this.densityPrev=new Float32Array(n),this.velocityX=new Float32Array(n),this.velocityY=new Float32Array(n),this.velocityXPrev=new Float32Array(n),this.velocityYPrev=new Float32Array(n),this.capacityField=new Float32Array(n);for(let c=0;c<Math.min(l,s);c++)for(let f=0;f<Math.min(g,e);f++){const a=c*g+f,d=this.getIndex(f,c);this.density[d]=r[a],this.velocityX[d]=o[a],this.velocityY[d]=h[a]}console.log(`FluidSimulation resized to ${e} × ${s}`)}setGridSize(t){this.gridSize=t,this.resize(this.width,this.height)}getVelocityAt(t,i){const e=t/this.gridSize,s=i/this.gridSize;if(e<0||e>=this.gridCols-1||s<0||s>=this.gridRows-1)return{u:0,v:0};const n=this.bilinearSample(this.velocityX,e,s),r=this.bilinearSample(this.velocityY,e,s);return{u:n*this.gridSize,v:r*this.gridSize}}}class ${constructor(t,i,e){this.width=t,this.height=i,this.gridSize=e,this.gridCols=Math.ceil(t/e),this.gridRows=Math.ceil(i/e),this.densityGrid=new Array(this.gridCols*this.gridRows).fill(0),this.maxDensity=10,this.minDensityToShow=1,this.backgroundColor="#ffffff",this.particleColor="#000000",console.log(`Grid initialized: ${this.gridCols} × ${this.gridRows} (${this.densityGrid.length} cells)`)}setDensityGrid(t){this.densityGrid=t}render(t){t.fillStyle=this.backgroundColor,t.fillRect(0,0,this.width,this.height);for(let i=0;i<this.gridRows;i++)for(let e=0;e<this.gridCols;e++){const s=i*this.gridCols+e,n=this.densityGrid[s];if(n<this.minDensityToShow)continue;const r=e*this.gridSize,o=i*this.gridSize,h=Math.min((n-this.minDensityToShow)/this.maxDensity,1),g=0,l=this.gridSize,c=g+(l-g)*h,f=.3+.7*h,a=(this.gridSize-c)/2;t.fillStyle=this.particleColor,t.globalAlpha=f,t.fillRect(r+a,o+a,c,c)}t.globalAlpha=1}resize(t,i){this.width=t,this.height=i,this.gridCols=Math.ceil(t/this.gridSize),this.gridRows=Math.ceil(i/this.gridSize),this.densityGrid=new Array(this.gridCols*this.gridRows).fill(0),console.log(`Grid resized: ${this.gridCols} × ${this.gridRows}`)}setGridSize(t){this.gridSize=t,this.resize(this.width,this.height)}debugDrawGrid(t){t.strokeStyle="rgba(0, 0, 0, 0.07)",t.lineWidth=.8;for(let i=0;i<=this.gridCols;i++){const e=i*this.gridSize;t.beginPath(),t.moveTo(e,0),t.lineTo(e,this.height),t.stroke()}for(let i=0;i<=this.gridRows;i++){const e=i*this.gridSize;t.beginPath(),t.moveTo(0,e),t.lineTo(this.width,e),t.stroke()}}}class Y{constructor(t){this.canvas=t,this.isActive=!1,this.x=0,this.y=0,this.prevX=0,this.prevY=0,this.setupEventListeners()}setupEventListeners(){this.canvas.addEventListener("mousedown",this.handleMouseDown.bind(this)),this.canvas.addEventListener("mousemove",this.handleMouseMove.bind(this)),this.canvas.addEventListener("mouseup",this.handleMouseUp.bind(this)),this.canvas.addEventListener("mouseleave",this.handleMouseUp.bind(this)),this.canvas.addEventListener("touchstart",this.handleTouchStart.bind(this),{passive:!1}),this.canvas.addEventListener("touchmove",this.handleTouchMove.bind(this),{passive:!1}),this.canvas.addEventListener("touchend",this.handleTouchEnd.bind(this)),this.canvas.addEventListener("touchcancel",this.handleTouchEnd.bind(this))}getCanvasPosition(t,i){const e=this.canvas.getBoundingClientRect();return{x:t-e.left,y:i-e.top}}handleMouseDown(t){this.isActive=!0;const i=this.getCanvasPosition(t.clientX,t.clientY);this.x=i.x,this.y=i.y,this.prevX=i.x,this.prevY=i.y}handleMouseMove(t){const i=this.getCanvasPosition(t.clientX,t.clientY);this.prevX=this.x,this.prevY=this.y,this.x=i.x,this.y=i.y}handleMouseUp(t){this.isActive=!1}handleTouchStart(t){if(t.preventDefault(),t.touches.length>0){this.isActive=!0;const i=t.touches[0],e=this.getCanvasPosition(i.clientX,i.clientY);this.x=e.x,this.y=e.y,this.prevX=e.x,this.prevY=e.y}}handleTouchMove(t){if(t.preventDefault(),t.touches.length>0){const i=t.touches[0],e=this.getCanvasPosition(i.clientX,i.clientY);this.prevX=this.x,this.prevY=this.y,this.x=e.x,this.y=e.y}}handleTouchEnd(t){this.isActive=!1}getMouseForce(){return{x:this.x,y:this.y,active:this.isActive}}getVelocity(){return{vx:this.x-this.prevX,vy:this.y-this.prevY}}applyToFluid(t,i=3){if(!this.isActive)return;const e=t.gridSize,s=this.getVelocity(),n=s.vx/e,r=s.vy/e,o=Math.floor(this.x/e),h=Math.floor(this.y/e),g=i*i;for(let l=-i;l<=i;l++)for(let c=-i;c<=i;c++){const f=c*c+l*l;if(f>g)continue;const a=o+c,d=h+l,u=1-Math.sqrt(f)/i;t.addVelocity(a,d,n*u,r*u)}}dispose(){this.canvas.removeEventListener("mousedown",this.handleMouseDown),this.canvas.removeEventListener("mousemove",this.handleMouseMove),this.canvas.removeEventListener("mouseup",this.handleMouseUp),this.canvas.removeEventListener("mouseleave",this.handleMouseUp),this.canvas.removeEventListener("touchstart",this.handleTouchStart),this.canvas.removeEventListener("touchmove",this.handleTouchMove),this.canvas.removeEventListener("touchend",this.handleTouchEnd),this.canvas.removeEventListener("touchcancel",this.handleTouchEnd)}}class X{constructor(){this.cache=new Map,this.stats={hits:0,misses:0,cacheSize:0}}_generateKey(t,i,e,s,n="normal",r="normal"){return`${t}_${i}_${e}_${s}_${n}_${r}`}renderGlyph(t,i,e,s="#000000",n="normal",r="normal"){const o=this._generateKey(t,i,e,s,n,r);if(this.cache.has(o))return this.stats.hits++,this.cache.get(o);const g=document.createElement("canvas").getContext("2d");g.font=`${r} ${n} ${i}px ${e}`;const l=g.measureText(t),c=Math.ceil(l.width)+8,f=i+8,a=document.createElement("canvas");a.width=c,a.height=f;const d=a.getContext("2d");d.imageSmoothingEnabled=!0,d.imageSmoothingQuality="high",d.font=`${r} ${n} ${i}px ${e}`,d.fillStyle=s,d.textAlign="center",d.textBaseline="middle",d.fillText(t,c/2,f/2);const u={canvas:a,width:c,height:f,offsetX:c/2,offsetY:f/2,char:t,fontSize:i,fontFamily:e,color:s};return this.cache.set(o,u),this.stats.misses++,this.stats.cacheSize=this.cache.size,u}get(t,i,e,s="#000000",n="normal",r="normal"){const o=this._generateKey(t,i,e,s,n,r);return this.cache.get(o)||null}preload(t,i,e,s="#000000",n="normal",r="normal"){const o=[...new Set(t.split(""))];return o.forEach(h=>{h===" "||h===`
`||h==="	"||this.renderGlyph(h,i,e,s,n,r)}),o.length}clear(){this.cache.clear(),this.stats.cacheSize=0}getStats(){const t=this.stats.hits+this.stats.misses;return{...this.stats,hitRate:t>0?(this.stats.hits/t*100).toFixed(2)+"%":"0%"}}estimateMemoryUsage(){let t=0;this.cache.forEach(s=>{t+=s.width*s.height});const i=t*4,e=i/(1024*1024);return e<1?`${(i/1024).toFixed(2)} KB`:`${e.toFixed(2)} MB`}}class z{constructor(t,i,e,s={}){this.char=t,this.x=i,this.y=e,this.originX=i,this.originY=e,this.vx=0,this.vy=0,this.fontSize=s.fontSize||16,this.fontFamily=s.fontFamily||"Arial",this.fontWeight=s.fontWeight||"normal",this.fontStyle=s.fontStyle||"normal",this.color=s.color||"#000000",this.opacity=s.opacity!==void 0?s.opacity:1,this.rotation=s.rotation||0,this.mass=s.mass||1,this.damping=s.damping||.98,this.isSpecial=s.isSpecial||!1,this.url=s.url||null,this.image=s.image||null,this.enableRotation=s.enableRotation||!1,this.enableScale=s.enableScale||!1,this.baseScale=1,this.scale=1,this.isHovered=!1,this.age=0}update(t,i={u:0,v:0},e=.1,s=null,n=1){this.age+=t,this.vx+=i.u*n,this.vy+=i.v*n;const r=this.x-this.originX,o=this.y-this.originY,h=-r*e,g=-o*e;this.vx+=h,this.vy+=g;const l=s!==null?s:this.damping;if(this.vx*=l,this.vy*=l,this.x+=this.vx,this.y+=this.vy,this.enableRotation){const c=Math.sqrt(this.vx*this.vx+this.vy*this.vy);this.rotation+=c*.01*t}if(this.enableScale){const c=Math.sqrt(this.vx*this.vx+this.vy*this.vy);this.scale=this.baseScale+Math.min(c*.01,.5)}}render(t,i){const e=i.get(this.char,this.fontSize,this.fontFamily,this.color,this.fontWeight,this.fontStyle);if(!e){const s=i.renderGlyph(this.char,this.fontSize,this.fontFamily,this.color,this.fontWeight,this.fontStyle);this._drawGlyph(t,s);return}this._drawGlyph(t,e)}_drawGlyph(t,i){t.save(),t.globalAlpha=this.opacity,t.translate(this.x,this.y),this.rotation!==0&&t.rotate(this.rotation);let e=this.scale;this.isSpecial&&this.isHovered&&(e*=1.3),e!==1&&t.scale(e,e),t.drawImage(i.canvas,-i.offsetX,-i.offsetY),t.restore()}containsPoint(t,i,e=null){e===null&&(e=this.fontSize/2);const s=t-this.x,n=i-this.y;return s*s+n*n<=e*e}updateOrigin(t,i){this.originX=t,this.originY=i}setColor(t){this.color=t}getSpeed(){return Math.sqrt(this.vx*this.vx+this.vy*this.vy)}getDistanceFromOrigin(){const t=this.x-this.originX,i=this.y-this.originY;return Math.sqrt(t*t+i*i)}reset(){this.x=this.originX,this.y=this.originY,this.vx=0,this.vy=0,this.rotation=0,this.scale=this.baseScale}}class D{constructor(t,i={}){this.fluidSimulator=t,this.config=i,this.particles=[],this.glyphCache=new X,this.currentConfig=null,this.stats={particleCount:0,visibleCount:0,updateTime:0,renderTime:0},this.viewportCulling=i.performance?.viewportCulling!==!1,this.viewportPadding=100,this.backgroundInvertEnabled=!1,this.backgroundCanvas=null,this.colorUpdateInterval=5,this.colorUpdateCounter=0,this.particlesPerFrameUpdate=10,this.canvas=null,this.hoveredParticle=null,this.clickCallback=null}generateFromText(t,i={}){const{fontSize:e=16,fontFamily:s="Arial",fontWeight:n="normal",fontStyle:r="normal",color:o="#000000",spacing:h=2,lineHeight:g=null,startX:l=100,startY:c=100,align:f="left"}=i;this.currentConfig={type:"text",text:t,...i},this.particles=[];const d=document.createElement("canvas").getContext("2d");d.font=`${r} ${n} ${e}px ${s}`;const u=g||e*1.2,p=t.split(`
`),m=[...new Set(t.replace(/\s/g,"").split(""))];return this.glyphCache.preload(m.join(""),e,s,o,n,r),p.forEach((y,v)=>{let x=0;for(const S of y)if(S===" ")x+=e/2;else{const I=d.measureText(S);x+=I.width+h}let w=l;f==="center"?w=l-x/2:f==="right"&&(w=l-x);const b=c+v*u;for(const S of y){if(S===`
`)continue;if(S===" "){w+=e/2;continue}const I=new z(S,w,b,{fontSize:e,fontFamily:s,fontWeight:n,fontStyle:r,color:o,...i});this.particles.push(I);const T=d.measureText(S);w+=T.width+h}}),this.stats.particleCount=this.particles.length,this.particles.length}generateFromHTML(t,i={}){const e=window.getComputedStyle(t),s=t.textContent,n={fontSize:parseInt(e.fontSize),fontFamily:e.fontFamily.replace(/['"]/g,""),fontWeight:e.fontWeight,fontStyle:e.fontStyle,color:e.color},r=this.fluidSimulator?{width:this.fluidSimulator.width,height:this.fluidSimulator.height}:{width:window.innerWidth,height:window.innerHeight},o={startX:i.startX!==void 0?i.startX:r.width/2,startY:i.startY!==void 0?i.startY:r.height/2,align:i.align||"center"};return this.generateFromText(s,{...n,...o,...i})}generateFromHTMLLayout(t,i={}){const{spacing:e=2,ignoreHidden:s=!0,offsetX:n=0,offsetY:r=0}=i;this.particles=[],this.currentConfig={type:"htmlLayout",container:t,...i};const o=t.getBoundingClientRect(),h=-o.left+n,g=-o.top+r;this._processBlockElements(t,s,e,h,g);const l=new Map;return this.particles.forEach(c=>{const f=`${c.fontSize}_${c.fontFamily}_${c.color}`;l.has(f)||l.set(f,{fontSize:c.fontSize,fontFamily:c.fontFamily,color:c.color,chars:new Set}),l.get(f).chars.add(c.char)}),l.forEach(({fontSize:c,fontFamily:f,color:a,chars:d})=>{this.glyphCache.preload([...d].join(""),c,f,a)}),this.stats.particleCount=this.particles.length,this.particles.length}_processBlockElements(t,i,e,s,n){for(const r of t.children){if(i){const h=window.getComputedStyle(r);if(h.display==="none"||h.visibility==="hidden"||h.opacity==="0")continue}const o=r.getBoundingClientRect();this._processInlineContent(r,o.left+s,o.top+n,e),this._processBlockElements(r,i,e,s,n)}}_processInlineContent(t,i,e,s){const r=document.createElement("canvas").getContext("2d"),o={x:i,y:e},h=l=>{if(l.nodeType===Node.TEXT_NODE){const c=l.textContent;if(!c||!c.trim())return;const f=l.parentElement,a=window.getComputedStyle(f),d=parseInt(a.fontSize),u=a.fontFamily.replace(/['"]/g,""),p=a.fontWeight,m=a.fontStyle,y=a.color;let v=null,x=f;for(;x&&x!==t;){if(x.tagName==="A"){v=x;break}x=x.parentElement}const w=v?v.getAttribute("href"):null,b=v?v.getAttribute("data-emoji"):null,S=!!w,I=S&&b,T=parseFloat(a.letterSpacing)||0;if(I){if(v._emojiCreated){r.font=`${m} ${p} ${d}px ${u}`;const R=r.measureText(c).width;o.x+=R+s;return}v._emojiCreated=!0;const F=new z(b,o.x,o.y+d,{fontSize:d*1.5,fontFamily:u,fontWeight:p,fontStyle:m,color:y,isSpecial:!0,url:w});this.particles.push(F),r.font=`${m} ${p} ${d}px ${u}`;const M=r.measureText(c).width;o.x+=M+s+T*c.length;return}r.font=`${m} ${p} ${d}px ${u}`;for(const F of c){if(F===`
`){o.x=i,o.y+=d*1.2;continue}if(F===" "){o.x+=d/2;continue}const M=new z(F,o.x,o.y+d,{fontSize:d,fontFamily:u,fontWeight:p,fontStyle:m,color:y,isSpecial:S,url:S?w:null});this.particles.push(M);const R=r.measureText(F);o.x+=R.width+s+T}}else if(l.nodeType===Node.ELEMENT_NODE){if(l.tagName==="A"&&l.hasAttribute("data-emoji")){const f=l.getAttribute("href"),a=l.getAttribute("data-emoji"),d=window.getComputedStyle(l),u=parseInt(d.fontSize),p=d.fontFamily.replace(/['"]/g,""),m=d.fontWeight,y=d.fontStyle,v=d.color,x=new z(a,o.x,o.y+u,{fontSize:u*1.5,fontFamily:p,fontWeight:m,fontStyle:y,color:v,isSpecial:!0,url:f});this.particles.push(x);const w=l.textContent;r.font=`${y} ${m} ${u}px ${p}`;const b=r.measureText(w).width;o.x+=b+s;return}const c=l.tagName.toLowerCase();if(c==="a"||c==="span"||c==="strong"||c==="em"||c==="b"||c==="i")for(const f of l.childNodes)h(f)}};for(const l of t.childNodes)h(l);t.querySelectorAll("a[data-emoji]").forEach(l=>delete l._emojiCreated)}_getTextNodes(t,i=!0){const e=[],s=n=>{if(!(n.nodeName==="SCRIPT"||n.nodeName==="STYLE"))if(n.nodeType===Node.TEXT_NODE&&n.textContent.trim()){const r=n.parentElement;if(i){const g=window.getComputedStyle(r);if(g.display==="none"||g.visibility==="hidden"||g.opacity==="0")return}let o=null,h=r;for(;h&&h!==t;){if(h.tagName==="A"){o=h;break}h=h.parentElement}e.push({node:n,element:r,linkElement:o,url:o?o.getAttribute("href"):null,emoji:o?o.getAttribute("data-emoji"):null})}else n.nodeType===Node.ELEMENT_NODE&&n.childNodes.forEach(r=>s(r))};return s(t),e}generateFromShape(t,i,e={}){const{fontSize:s=16,density:n=.5,threshold:r=128,...o}=e;this.currentConfig={type:"shape",chars:t,shape:i,...e},this.particles=[];let h,g;if(i instanceof HTMLCanvasElement)h=i,g=h.getContext("2d");else if(i.canvas)h=i.canvas,g=h.getContext("2d");else return console.error("Invalid shape parameter"),0;const l=g.getImageData(0,0,h.width,h.height),c=t.split("");this.glyphCache.preload(t,s,o.fontFamily||"Arial",o.color||"#000000");let f=0;for(let a=0;a<h.height;a+=s)for(let d=0;d<h.width;d+=s){const u=(a*h.width+d)*4,p=l.data[u],m=l.data[u+1],y=l.data[u+2],v=l.data[u+3],x=(p+m+y)/3;if(v>r&&x>r&&Math.random()<n){const w=c[f%c.length],b=new z(w,d,a,{fontSize:s,...o});this.particles.push(b),f++}}return this.stats.particleCount=this.particles.length,this.particles.length}addSpecialParticle(t,i,e,s={}){const n=new z(t,i,e,{isSpecial:!0,fontSize:32,...s});return this.particles.push(n),this.stats.particleCount=this.particles.length,n}update(t){const i=performance.now(),{springConstant:e=.1,damping:s=.98,fluidInfluence:n=.5}=this.config.physics||{};this.particles.forEach(r=>{let o={u:0,v:0};this.fluidSimulator&&this.fluidSimulator.getVelocityAt&&(o=this.fluidSimulator.getVelocityAt(r.x,r.y)),r.update(t,o,e,s,n)}),this.backgroundInvertEnabled&&this._updateParticleColors(),this.stats.updateTime=performance.now()-i}render(t,i=null){const e=performance.now();i||(i={left:-this.viewportPadding,right:t.canvas.width+this.viewportPadding,top:-this.viewportPadding,bottom:t.canvas.height+this.viewportPadding});let s=0;this.particles.forEach(n=>{this.viewportCulling&&(n.x<i.left||n.x>i.right||n.y<i.top||n.y>i.bottom)||(n.render(t,this.glyphCache),s++)}),this.stats.visibleCount=s,this.stats.renderTime=performance.now()-e}resize(t,i){this.currentConfig&&(this.glyphCache.clear(),this.currentConfig.type==="text"?this.generateFromText(this.currentConfig.text,this.currentConfig):this.currentConfig.type==="shape"&&this.generateFromShape(this.currentConfig.chars,this.currentConfig.shape,this.currentConfig))}getParticleAt(t,i){for(let e=this.particles.length-1;e>=0;e--){const s=this.particles[e];if(s.containsPoint(t,i))return s}return null}getSpecialParticles(){return this.particles.filter(t=>t.isSpecial)}clear(){this.particles=[],this.glyphCache.clear(),this.currentConfig=null,this.stats.particleCount=0}setBackgroundInvert(t,i=null){if(this.backgroundInvertEnabled=t,this.backgroundCanvas=i,!t){const e=this.currentConfig?.color||"#000000";this.particles.forEach(s=>s.setColor(e)),this.glyphCache.clear()}}_updateParticleColors(){if(!this.backgroundInvertEnabled||!this.backgroundCanvas)return;const i=this.backgroundCanvas.getContext("2d").getImageData(0,0,this.backgroundCanvas.width,this.backgroundCanvas.height),e=this.colorUpdateCounter*this.particlesPerFrameUpdate%this.particles.length,s=Math.min(e+this.particlesPerFrameUpdate,this.particles.length);for(let n=e;n<s;n++){const r=this.particles[n],o=Math.floor(r.x),h=Math.floor(r.y);if(o<0||o>=this.backgroundCanvas.width||h<0||h>=this.backgroundCanvas.height)continue;const g=(h*this.backgroundCanvas.width+o)*4,l=i.data[g],c=i.data[g+1],f=i.data[g+2],a=255-l,d=255-c,u=255-f,p=`rgb(${a}, ${d}, ${u})`;r.color!==p&&r.setColor(p)}this.colorUpdateCounter++}enableInteraction(t,i=null){this.canvas=t,this.clickCallback=i,this._handleClick=e=>{const s=t.getBoundingClientRect(),n=e.clientX-s.left,r=e.clientY-s.top,o=this.getParticleAt(n,r);o&&o.isSpecial&&(this.clickCallback?this.clickCallback(o):o.url&&window.open(o.url,"_blank"))},this._handleMouseMove=e=>{const s=t.getBoundingClientRect(),n=e.clientX-s.left,r=e.clientY-s.top,o=this.getParticleAt(n,r);this.hoveredParticle&&this.hoveredParticle!==o&&(this.hoveredParticle.isHovered=!1),o&&o.isSpecial?(o.isHovered=!0,this.hoveredParticle=o,t.style.cursor="pointer"):(this.hoveredParticle=null,t.style.cursor="default")},t.addEventListener("click",this._handleClick),t.addEventListener("mousemove",this._handleMouseMove)}disableInteraction(){this.canvas&&(this._handleClick&&this.canvas.removeEventListener("click",this._handleClick),this._handleMouseMove&&this.canvas.removeEventListener("mousemove",this._handleMouseMove),this.canvas.style.cursor="default",this.canvas=null)}getStats(){return{...this.stats,cacheStats:this.glyphCache.getStats(),memoryUsage:this.glyphCache.estimateMemoryUsage(),backgroundInvert:this.backgroundInvertEnabled,specialParticles:this.getSpecialParticles().length}}}const L={particles:{density:0,attractionCapacity:5.5,mouseRepulsionRadius:5},fluid:{viscosity:1e-4,diffusion:0,forceMultiplier:10,velocityDissipation:.99,densityDissipation:.99,iterations:4},grid:{size:12,maxDensity:150,minDensityToShow:10,backgroundColor:"#ffffff",particleColor:"#000000"},forceField:{fields:[{type:"text",text:"HELLO",fontSize:null,fontWeight:"bold",blur:10},{type:"text",text:"DRAG ME",fontSize:null,fontWeight:"bold",blur:5},{type:"image",scale:.5,src:"/themes/pixel-fluid/images/UoU.png",blur:2}],switchInterval:7e3,transitionDuration:800},textParticles:{enabled:!0,content:{type:"htmlLayout",text:`HELLO
WORLD`,htmlSelector:"#particle-text-source",htmlContainer:".pixel-fluid-content",fontSize:48,fontFamily:"Arial",fontWeight:"bold",fontStyle:"normal",color:"#000000",spacing:1,lineHeight:null,align:"center",startX:null,startY:null},visual:{backgroundInvert:!1},physics:{fluidInfluence:5,springConstant:.2,damping:.1,enableRotation:!1,enableScale:!1},performance:{viewportCulling:!0,maxParticles:1e4}},performance:{targetFPS:60,enableDebug:!0}},A=`<!DOCTYPE html>\r
<meta charset="UTF-8" />\r
<meta name="viewport" content="width=device-width, initial-scale=1.0" />\r
<div class="pixel-fluid-content" style="padding-left: 10%;">\r
  <!-- htmlLayout模式：所有可见的HTML内容都会被转换为粒子 -->\r
  <!-- 保持原有的布局和样式 -->\r
  <!-- visibility: hidden 让元素仍然占据布局空间，但不可见 -->\r
\r
  <h1 style="\r
    \r
    font-size: 48px;\r
    font-weight: bold;\r
    color: #000000;\r
    margin-bottom: 20px;\r
  ">Welcome!</h1>\r
\r
  <p style="\r
    font-size: 20px;\r
    color: #333333;\r
    margin-bottom: 15px;\r
  ">This is Shu Chen's Personal Website</p>\r
\r
\r
  <div style="\r
    font-size: 16px;\r
    color: #323232;\r
    margin-top: 30px;\r
    display: flex;\r
    flex-direction: column;\r
    gap: 10px;\r
  ">\r
    <p>• My Notes    <a href="note.html" data-emoji="📖"></a></p>\r
    <p>• My Resume   <a href="cv.html" data-emoji="📃"></a></p>\r
    <p>• My Linkedin    <a href="https://www.linkedin.com/in/%E6%A0%91-%E9%99%88-89a32b34b/" data-emoji="💼"></a></p>\r
  </div>\r
</div>\r
\r
<!-- Grid Size Control -->\r
<div class="grid-control">\r
  <label for="grid-size-slider">Grid Precision</label>\r
  <input type="range" id="grid-size-slider" min="10" max="20" value="12" step="1">\r
  <span id="grid-size-value">12</span>\r
</div>\r
`,G=`/* Pixel Fluid Theme Styles */\r
\r
.pixel-fluid-content {\r
  position: relative;\r
  z-index: 10;\r
  max-width: 800px;\r
  margin: 0 auto;\r
  padding: 4rem 2rem;\r
  color: #333;\r
  pointer-events: none;\r
}\r
\r
.pixel-fluid-content * {\r
  pointer-events: auto;\r
}\r
\r
/* Header */\r
.pf-header {\r
  text-align: center;\r
  margin-bottom: 4rem;\r
}\r
\r
.pf-title {\r
  font-size: 3rem;\r
  font-weight: 900;\r
  margin: 0;\r
  margin-bottom: 1rem;\r
  color: #000;\r
  letter-spacing: -0.02em;\r
}\r
\r
.pf-subtitle {\r
  font-size: 1.25rem;\r
  margin: 0;\r
  color: #666;\r
  font-weight: 400;\r
}\r
\r
/* Sections */\r
.pf-about,\r
.pf-features {\r
  background: rgba(255, 255, 255, 0.9);\r
  backdrop-filter: blur(10px);\r
  border-radius: 12px;\r
  padding: 2rem;\r
  margin-bottom: 2rem;\r
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\r
}\r
\r
.pf-about h2,\r
.pf-features h2 {\r
  margin-top: 0;\r
  margin-bottom: 1rem;\r
  font-size: 1.75rem;\r
  color: #000;\r
}\r
\r
.pf-about p {\r
  line-height: 1.6;\r
  margin-bottom: 1rem;\r
  color: #444;\r
}\r
\r
.pf-about p:last-child {\r
  margin-bottom: 0;\r
}\r
\r
.pf-features ul {\r
  list-style: none;\r
  padding: 0;\r
  margin: 0;\r
}\r
\r
.pf-features li {\r
  padding: 0.5rem 0;\r
  padding-left: 1.5rem;\r
  position: relative;\r
  color: #444;\r
  line-height: 1.6;\r
}\r
\r
.pf-features li::before {\r
  content: '→';\r
  position: absolute;\r
  left: 0;\r
  color: #000;\r
  font-weight: bold;\r
}\r
\r
/* Responsive Design */\r
@media (max-width: 768px) {\r
  .pixel-fluid-content {\r
    padding: 2rem 1rem;\r
  }\r
\r
  .pf-title {\r
    font-size: 2rem;\r
  }\r
\r
  .pf-subtitle {\r
    font-size: 1rem;\r
  }\r
\r
  .pf-about,\r
  .pf-features {\r
    padding: 1.5rem;\r
  }\r
}\r
\r
/* Canvas Interaction Hint */\r
body {\r
  cursor: default;\r
}\r
\r
canvas.webgl {\r
  cursor: grab;\r
  pointer-events: auto; /* 启用鼠标事件，覆盖全局的 pointer-events: none */\r
}\r
\r
canvas.webgl:active {\r
  cursor: grabbing;\r
}\r
\r
/* Grid Size Control */\r
.grid-control {\r
  position: fixed;\r
  bottom: 20px;\r
  left: 20px;\r
  z-index: 1000;\r
  background: rgba(255, 255, 255, 0.9);\r
  backdrop-filter: blur(10px);\r
  padding: 15px 20px;\r
  border-radius: 8px;\r
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\r
  display: flex;\r
  align-items: center;\r
  gap: 12px;\r
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\r
  pointer-events: auto;\r
}\r
\r
.grid-control label {\r
  font-size: 14px;\r
  font-weight: 600;\r
  color: #333;\r
  margin: 0;\r
}\r
\r
.grid-control input[type="range"] {\r
  width: 120px;\r
  height: 4px;\r
  background: #ddd;\r
  outline: none;\r
  border-radius: 2px;\r
  cursor: pointer;\r
}\r
\r
.grid-control input[type="range"]::-webkit-slider-thumb {\r
  -webkit-appearance: none;\r
  appearance: none;\r
  width: 16px;\r
  height: 16px;\r
  background: #000;\r
  border-radius: 50%;\r
  cursor: pointer;\r
}\r
\r
.grid-control input[type="range"]::-moz-range-thumb {\r
  width: 16px;\r
  height: 16px;\r
  background: #000;\r
  border-radius: 50%;\r
  cursor: pointer;\r
  border: none;\r
}\r
\r
.grid-control #grid-size-value {\r
  font-size: 14px;\r
  font-weight: 700;\r
  color: #000;\r
  min-width: 25px;\r
  text-align: center;\r
}\r
\r
@media (max-width: 768px) {\r
  .grid-control {\r
    bottom: 10px;\r
    left: 10px;\r
    padding: 10px 15px;\r
    font-size: 12px;\r
  }\r
\r
  .grid-control input[type="range"] {\r
    width: 80px;\r
  }\r
}\r
`;class _ extends k{constructor(t,i){super(t,i),this.config=L,this.renderCanvas=t,this.ctx=this.renderCanvas.getContext("2d"),this.pixelRatio=Math.min(window.devicePixelRatio,2),this.forceField=null,this.fluidSim=null,this.gridRenderer=null,this.interactionController=null,this.textParticleSystem=null,this.lastTime=performance.now(),this.showVelocityField=!1,this.forceFieldIndex=0,this.forceFieldTimer=null,this.forceFieldTransitioning=!1,this.transitionProgress=0,this.setupKeyboardListeners(),this.gridSizeSlider=null,this.gridSizeValue=null,this.gridSizeChangeHandler=null}setupKeyboardListeners(){this.keyHandler=t=>{(t.key==="v"||t.key==="V")&&(this.showVelocityField=!this.showVelocityField)},window.addEventListener("keydown",this.keyHandler)}async init(){if(this.renderCanvas.width=this.sizes.width*this.pixelRatio,this.renderCanvas.height=this.sizes.height*this.pixelRatio,this.renderCanvas.style.width=`${this.sizes.width}px`,this.renderCanvas.style.height=`${this.sizes.height}px`,this.ctx.scale(this.pixelRatio,this.pixelRatio),this.forceField=new P(this.sizes.width,this.sizes.height),this.forceField.generateField(this.config.forceField.text,{fontSize:this.config.forceField.fontSize,fontFamily:this.config.forceField.fontFamily,fontWeight:this.config.forceField.fontWeight,blur:this.config.forceField.blur}),this.fluidSim=new E(this.sizes.width,this.sizes.height,this.config.grid.size),this.fluidSim.initializeDensity(this.config.particles.density||5),this.fluidSim.viscosity=this.config.fluid?.viscosity||1e-4,this.fluidSim.diffusion=this.config.fluid?.diffusion||1e-4,this.fluidSim.forceMultiplier=this.config.fluid?.forceMultiplier||50,this.fluidSim.velocityDissipation=this.config.fluid?.velocityDissipation||.99,this.fluidSim.densityDissipation=this.config.fluid?.densityDissipation||.995,this.fluidSim.iterations=this.config.fluid?.iterations||4,this.gridRenderer=new $(this.sizes.width,this.sizes.height,this.config.grid.size),this.gridRenderer.maxDensity=this.config.grid.maxDensity,this.gridRenderer.minDensityToShow=this.config.grid.minDensityToShow,this.gridRenderer.backgroundColor=this.config.grid.backgroundColor,this.gridRenderer.particleColor=this.config.grid.particleColor,this.interactionController=new Y(this.renderCanvas),this.config.textParticles?.enabled){this.textParticleSystem=new D(this.fluidSim,{physics:this.config.textParticles.physics,performance:this.config.textParticles.performance});const t=this.config.textParticles.content;if(t.type==="htmlLayout"){const i=document.querySelector(t.htmlContainer);i?(i.style.visibility,i.style.visibility="visible",requestAnimationFrame(()=>{requestAnimationFrame(()=>{this.textParticleSystem.generateFromHTMLLayout(i,{spacing:t.spacing,offsetX:0,offsetY:0,ignoreHidden:!1}),i.style.visibility="hidden"})})):console.error(`HTML container not found: ${t.htmlContainer}`)}else if(t.type==="html"){const i=document.querySelector(t.htmlSelector);i?this.textParticleSystem.generateFromHTML(i,{spacing:t.spacing,lineHeight:t.lineHeight,align:t.align}):console.error(`HTML element not found: ${t.htmlSelector}`)}else{const i=t.startX!==null?t.startX:this.sizes.width/2,e=t.startY!==null?t.startY:this.sizes.height/2;this.textParticleSystem.generateFromText(t.text,{fontSize:t.fontSize,fontFamily:t.fontFamily,fontWeight:t.fontWeight,fontStyle:t.fontStyle,color:t.color,spacing:t.spacing,lineHeight:t.lineHeight,align:t.align,startX:i,startY:e})}t.type,this.config.textParticles.visual?.backgroundInvert&&this.textParticleSystem.setBackgroundInvert(!0,this.renderCanvas),this.textParticleSystem.enableInteraction(this.renderCanvas,i=>{i.url&&window.open(i.url,"_blank")})}this.isInitialized=!0,this.startForceFieldRotation(),this.setupGridSizeControl()}setupGridSizeControl(){if(this.gridSizeSlider=document.getElementById("grid-size-slider"),this.gridSizeValue=document.getElementById("grid-size-value"),!this.gridSizeSlider||!this.gridSizeValue){console.warn("Grid size control elements not found");return}this.gridSizeSlider.value=this.config.grid.size,this.gridSizeValue.textContent=this.config.grid.size,this.gridSizeChangeHandler=t=>{const i=parseInt(t.target.value);this.gridSizeValue.textContent=i,this.updateGridSize(i)},this.gridSizeSlider.addEventListener("input",this.gridSizeChangeHandler)}updateGridSize(t){!this.isInitialized||t===this.config.grid.size||(this.config.grid.size=t,this.fluidSim&&this.fluidSim.setGridSize(t),this.gridRenderer&&this.gridRenderer.setGridSize(t))}startForceFieldRotation(){const t=this.config.forceField.fields;if(!t||t.length===0||t.length<2)return;const i=this.config.forceField.switchInterval||3e3;this.forceFieldTimer=setInterval(()=>{this.switchToNextForceField()},i)}stopForceFieldRotation(){this.forceFieldTimer&&(clearInterval(this.forceFieldTimer),this.forceFieldTimer=null)}switchToNextForceField(){const t=this.config.forceField.fields;if(!t||t.length<2)return;this.forceFieldIndex=(this.forceFieldIndex+1)%t.length;const i=t[this.forceFieldIndex];this.applyForceField(i)}async applyForceField(t){if(!this.forceField)return;const i=t.type||"text";try{switch(i){case"image":await this.forceField.generateFieldFromImage(t.src,{fit:t.fit??"contain",scale:t.scale??1,threshold:t.threshold??128,invert:t.invert??!1,blur:t.blur??this.config.forceField.blur});break;case"svg":await this.forceField.generateFieldFromSVG(t.src,{scale:t.scale??1,blur:t.blur??this.config.forceField.blur});break;case"text":default:const e={fontSize:t.fontSize??this.config.forceField.fontSize,fontFamily:t.fontFamily??this.config.forceField.fontFamily,fontWeight:t.fontWeight??this.config.forceField.fontWeight,blur:t.blur??this.config.forceField.blur};this.forceField.generateField(t.text,e);break}}catch(e){console.error("Failed to apply force field:",e),this.forceField.generateField("ERROR",{fontSize:this.config.forceField.fontSize,blur:this.config.forceField.blur})}}tick(){if(!this.isInitialized){console.warn("Tick called but theme not initialized");return}const t=performance.now(),i=Math.min((t-this.lastTime)/1e3,.1);this.lastTime=t;const e=this.config.particles.density*.7,s=this.config.particles.attractionCapacity||10;this.fluidSim.updateCapacityField(this.forceField,e,s);const n=this.config.particles.mouseRepulsionRadius||3;this.interactionController.applyToFluid(this.fluidSim,n),this.fluidSim.step(i);const r=this.fluidSim.getDensityGrid();if(this.gridRenderer.setDensityGrid(r),this.gridRenderer.render(this.ctx),this.textParticleSystem&&(this.textParticleSystem.update(i),this.textParticleSystem.render(this.ctx)),this.config.performance.enableDebug){this.gridRenderer.debugDrawGrid(this.ctx);const o=Math.round(1/i),h=this.fluidSim.getGridInfo();let g=0,l=0;for(let u=0;u<this.fluidSim.density.length;u++){g+=this.fluidSim.density[u];const p=Math.sqrt(this.fluidSim.velocityX[u]**2+this.fluidSim.velocityY[u]**2);p>l&&(l=p)}const c=this.interactionController.getMouseForce();let f=0;if(c.active){const u=Math.floor(c.x/h.size),p=Math.floor(c.y/h.size);if(this.fluidSim.isValid(u,p)){const m=this.fluidSim.getIndex(u,p),y=this.fluidSim.velocityX[m],v=this.fluidSim.velocityY[m];f=Math.sqrt(y*y+v*v)}}this.ctx.fillStyle="blue",this.ctx.font="16px monospace";let a=20;const d=20;if(this.ctx.fillText(`FPS: ${o}`,10,a),a+=d,this.ctx.fillText(`Grid: ${h.cols} × ${h.rows}`,10,a),a+=d,this.ctx.fillText(`Total Density: ${g.toFixed(0)}`,10,a),a+=d,this.ctx.fillText(`Max Velocity: ${l.toFixed(2)}`,10,a),a+=d,this.ctx.fillText(`Mouse Velocity: ${f.toFixed(2)}`,10,a),a+=d,this.ctx.fillText("Fluid Sim (Navier-Stokes)",10,a),a+=d,this.textParticleSystem){const u=this.textParticleSystem.getStats();a+=10,this.ctx.fillText(`Text Particles: ${u.particleCount}`,10,a),a+=d,this.ctx.fillText(`Visible: ${u.visibleCount}`,10,a),a+=d,this.ctx.fillText(`Cache: ${u.cacheStats.cacheSize} glyphs (${u.cacheStats.hitRate})`,10,a),a+=d,this.ctx.fillText(`Memory: ${u.memoryUsage}`,10,a),a+=d}this.showVelocityField&&this.debugDrawVelocityField()}}resize(t){if(this.sizes=t,this.renderCanvas.width=t.width*this.pixelRatio,this.renderCanvas.height=t.height*this.pixelRatio,this.renderCanvas.style.width=`${t.width}px`,this.renderCanvas.style.height=`${t.height}px`,this.ctx.setTransform(1,0,0,1,0,0),this.ctx.scale(this.pixelRatio,this.pixelRatio),this.forceField&&this.forceField.resize(t.width,t.height),this.fluidSim&&this.fluidSim.resize(t.width,t.height),this.gridRenderer&&this.gridRenderer.resize(t.width,t.height),this.textParticleSystem&&this.config.textParticles?.enabled){const i=this.config.textParticles.content;if(this.textParticleSystem.resize(t.width,t.height),i.type==="htmlLayout"){const e=document.querySelector(i.htmlContainer);e&&(e.style.visibility="visible",requestAnimationFrame(()=>{requestAnimationFrame(()=>{this.textParticleSystem.generateFromHTMLLayout(e,{spacing:i.spacing,offsetX:0,offsetY:0,ignoreHidden:!1}),e.style.visibility="hidden"})}))}else if(i.type==="html"){const e=document.querySelector(i.htmlSelector);e&&this.textParticleSystem.generateFromHTML(e,{spacing:i.spacing,lineHeight:i.lineHeight,align:i.align})}else{const e=i.startX!==null?i.startX:t.width/2,s=i.startY!==null?i.startY:t.height/2;this.textParticleSystem.generateFromText(i.text,{fontSize:i.fontSize,fontFamily:i.fontFamily,fontWeight:i.fontWeight,fontStyle:i.fontStyle,color:i.color,spacing:i.spacing,lineHeight:i.lineHeight,align:i.align,startX:e,startY:s})}}}dispose(){console.log("Disposing Pixel Fluid Theme..."),this.stopForceFieldRotation(),this.keyHandler&&window.removeEventListener("keydown",this.keyHandler),this.gridSizeSlider&&this.gridSizeChangeHandler&&this.gridSizeSlider.removeEventListener("input",this.gridSizeChangeHandler),this.interactionController&&this.interactionController.dispose(),this.textParticleSystem&&(this.textParticleSystem.disableInteraction(),this.textParticleSystem.clear()),this.ctx&&this.ctx.clearRect(0,0,this.renderCanvas.width,this.renderCanvas.height),this.isInitialized=!1}static getMetadata(){return{id:"pixel-fluid",name:"Pixel Fluid",description:"Interactive particle-based grid visualization with force fields",author:"Your Name",complexity:"medium",htmlContent:A,styles:G}}setForceFieldText(t){this.forceField&&this.forceField.generateField(t,{fontSize:this.config.forceField.fontSize,fontFamily:this.config.forceField.fontFamily,fontWeight:this.config.forceField.fontWeight,blur:this.config.forceField.blur})}setParticleDensity(t){this.fluidSim&&(this.fluidSim.initializeDensity(t),console.log(`Particle density updated to ${t}`))}debugDrawVelocityField(){const t=this.fluidSim.getGridInfo(),i=3;this.ctx.strokeStyle="rgba(255, 0, 0, 0.5)",this.ctx.lineWidth=1;for(let e=0;e<t.rows;e+=i)for(let s=0;s<t.cols;s+=i){const n=this.fluidSim.getIndex(s,e),r=this.fluidSim.velocityX[n],o=this.fluidSim.velocityY[n],h=20,g=(s+.5)*t.size,l=(e+.5)*t.size;this.ctx.beginPath(),this.ctx.moveTo(g,l),this.ctx.lineTo(g+r*h,l+o*h),this.ctx.stroke()}}}export{_ as default};
