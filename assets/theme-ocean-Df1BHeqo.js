import{C as _,S as F,a as $,P as B,G as z,W,L as X,b as v,R as w,A as Y,D as N,c as S,d as q,N as P,e as H,E as V,B as k,f,M as R,T as G,g as Z,V as y,h as C,K as b,i as J,j as K,k as Q,l as ee,m as ne,n as te,o as ie,p as se,O as oe}from"./vendor-three-C29NQ9Z3.js";class M{constructor(e,n){if(this.constructor===M)throw new Error("BaseTheme is abstract and cannot be instantiated directly");this.canvas=e,this.sizes=n,this.scene=null,this.camera=null,this.renderer=null,this.clock=new _,this.isInitialized=!1,this.requiresReloadOnResize=!1,this.resizeReloadDelay=500}async init(){throw new Error(`${this.constructor.name}.init() must be implemented`)}tick(){throw new Error(`${this.constructor.name}.tick() must be implemented`)}resize(e){throw new Error(`${this.constructor.name}.resize() must be implemented`)}dispose(){throw new Error(`${this.constructor.name}.dispose() must be implemented`)}onScroll(e){}onMouseMove(e){}async onContentReady(){}static getMetadata(){return{id:"base",name:"Base Theme",description:"Abstract base theme",author:"Unknown",complexity:"low",htmlContent:"",styles:""}}getHTMLContent(){return this.constructor.getMetadata().htmlContent}getStyles(){return this.constructor.getMetadata().styles}isReady(){return this.isInitialized}}class ae{constructor(e,n,t){this.canvas=e,this.sizes=n,this.config=t,this.scene=null,this.camera=null,this.renderer=null,this.cameraGroup=null}setup(){return this.scene=new F,this.config.scene.backgroundColor&&(this.scene.background=new $(this.config.scene.backgroundColor)),this.camera=new B(this.config.scene.cameraFov,this.sizes.width/this.sizes.height,.1,1e3),this.camera.position.y=this.config.scene.cameraY,this.camera.position.z=this.config.scene.cameraZ,this.cameraGroup=new z,this.scene.add(this.cameraGroup),this.cameraGroup.add(this.camera),this.renderer=new W({canvas:this.canvas,alpha:this.config.renderer.alpha,stencil:this.config.renderer.stencil}),this.renderer.autoClear=!1,this.renderer.setClearColor(0,0),this.renderer.setSize(this.sizes.width,this.sizes.height),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,this.config.renderer.pixelRatio)),this.renderer.outputColorSpace=X,console.log("Scene setup completed"),{scene:this.scene,camera:this.camera,renderer:this.renderer,cameraGroup:this.cameraGroup}}resize(e){this.sizes=e,this.camera&&(this.camera.aspect=e.width/e.height,this.camera.updateProjectionMatrix()),this.renderer&&(this.renderer.setSize(e.width,e.height),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,this.config.renderer.pixelRatio)))}dispose(){this.renderer&&this.renderer.dispose(),this.scene&&this.scene.clear()}getScene(){return this.scene}getCamera(){return this.camera}getRenderer(){return this.renderer}getCameraGroup(){return this.cameraGroup}}var re=`varying vec2 vUv;
uniform float time;
varying vec3 vWorldPosition;
void main()
{
    vUv = uv;

    float offsety = sin(time * 20.0) * 0.02;
    
    vec3 movedPosition = position + vec3(0.0, offsety, 0.0);
    vec4 worldPosition = modelMatrix * vec4(movedPosition, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position + vec3(0.0,offsety,0.0), 1.0);
}`,le=`uniform float time;\r
uniform float waveFrequency;\r
uniform float waveAmplitude;\r
uniform float top;\r
uniform bool reverse;\r
varying vec3 vWorldPosition;\r
varying vec2 vUv;

void main() {

    float shiftedX1 = vUv.x + time * 0.1; \r
    float shiftedX2 = vUv.x + time * 0.4 + 0.4; \r
    float shiftedX3 = vUv.x + time * -0.6 + 0.8; \r
    float shiftedX4 = vUv.x + time * 0.3 + 1.8; 

    float wave = 0.0;\r
    wave += sin(shiftedX1 * waveFrequency + time * 4.0) * waveAmplitude * 0.6;\r
    wave += sin(shiftedX2 * waveFrequency * 2.0 + time * 1.5) * waveAmplitude * 0.3;\r
    wave += sin(shiftedX3 * waveFrequency * 0.5 + time * 1.0) * waveAmplitude * 0.4;\r
    wave += sin(shiftedX4 * waveFrequency * 0.5 + time * 1.0) * waveAmplitude * 1.0;\r

    
    float dynamicTop = top + (wave - waveAmplitude * 0.5) * 0.2;

    bool insideVertical = vWorldPosition.y <= dynamicTop;

    if(reverse)\r
    {\r
        insideVertical = ! (vWorldPosition.y <= dynamicTop-0.08); 
    }\r
    \r
    if (insideVertical) {\r
        discard; 
    } else {\r
        gl_FragColor = vec4(1.0, 0.0, 0.0, 0.2); 
    }\r
}`,ce=`uniform float ratio;

varying vec2 vUv;
uniform float time;

void main() {
    float scale = 4.0;

    vUv = uv * scale * vec2(ratio, 1.0) - vec2(time,scale - 1.0);
    float offsety = sin(time * 20.0) * 0.02;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position + vec3(0.0,offsety,0.0), 1.0);
}`,de=`uniform float time;
uniform sampler2D uTexture;

varying vec2 vUv;

vec3 SRGBtoLinear(vec3 srgbColor) {
    return pow(srgbColor, vec3(1.0 / 2.2));
}

void main() {
    vec4 color = texture2D(uTexture, vUv);  
    vec3 linearColor = SRGBtoLinear(color.rgb);
    gl_FragColor = vec4(linearColor, color.a);
}`,he=`uniform float time;
varying vec3 vColor;

void main() {
    vColor = vec3(1.0); 

    vec3 pos = position;

    
    float angleX = time * 0.5; 
    float angleY = time * 0.8;
    float angleZ = time * 1.2;

    
    mat3 rotX = mat3(
        1.0,        0.0,         0.0,
        0.0,  cos(angleX), -sin(angleX),
        0.0,  sin(angleX),  cos(angleX)
    );

    
    mat3 rotY = mat3(
        cos(angleY), 0.0, sin(angleY),
        0.0,         1.0, 0.0,
        -sin(angleY),0.0, cos(angleY)
    );

    
    mat3 rotZ = mat3(
        cos(angleZ), -sin(angleZ), 0.0,
        sin(angleZ),  cos(angleZ), 0.0,
        0.0,          0.0,         1.0
    );

    
    pos = rotZ * rotY * rotX * pos;

    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    gl_PointSize = 0.01;
}`,me=`void main() {
    gl_FragColor = vec4(1,1,1,1);
}`,pe=`uniform float time;
varying vec3 vColor;
attribute float id;

void main() {
    float brightness = abs(sin(time + id * 100.0)*3.0);
    vColor = vec3(brightness); 

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 0.01 + brightness * 0.02;
}`,ue=`varying vec3 vColor;
void main() {
    gl_FragColor = vec4(vColor,1);
}`,ge=`varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}`,fe=`uniform sampler2D tDiffuse;
uniform sampler2D tNormal;
uniform float time;
uniform float bumpScale;
varying vec2 vUv;

void main() {
    
    vec2 uvShift = vUv * 2.0 + vec2(time * 0.05, time * 0.02);

    
    vec3 normalSample = texture2D(tNormal, uvShift).rgb * 2.0 - 1.0;
    vec2 bump = normalSample.rg * bumpScale;

    
    vec2 distortedUv = vUv + bump;
    vec4 color = texture2D(tDiffuse, distortedUv);

    gl_FragColor = color;

}`;function ve(s){return{uniforms:{tDiffuse:{value:null},tNormal:{value:s},time:{value:0},bumpScale:{value:.05}},vertexShader:ge,fragmentShader:fe}}function xe(s,e){return new v({vertexShader:ce,fragmentShader:de,uniforms:{ratio:{value:s},time:{value:0},uTexture:{value:e}},transparent:!0,alphaTest:.5})}function O(s,e,n=!1){return new v({vertexShader:re,fragmentShader:le,uniforms:{time:{value:0},waveFrequency:{value:100*e},waveAmplitude:{value:.2},top:{value:s},reverse:{value:n}},side:N,transparent:!0,stencilWrite:!0,stencilFunc:Y,stencilRef:1,stencilFail:w,stencilZFail:w,stencilZPass:w,stencilFuncMask:255,colorWrite:!1})}function ye(){return new v({vertexShader:he,fragmentShader:me,uniforms:{time:{value:0}}})}const T={vertex:pe,fragment:ue},we=s=>{const e=s.fov*(Math.PI/180),n=2*Math.tan(e/2)*(s.position.z+.5),t=n*s.aspect,i=t/n;return{width:t,height:n,ratio:i}},be=(s,e,n)=>{s.wrapS=S,s.wrapT=q,s.magFilter=P,s.minFilter=P,s.repeat.set(e,n),s.colorSpace=H};function Se(s){s.stencilTest=!0,s.stencilWrite=!1,s.stencilFunc=V,s.stencilRef=1,s.stencilFuncMask=255}function L(s,e,n=1){if(s.length===0){s.push({mesh:e,baseX:e.position.x,baseY:e.position.y,depthFactor:0});return}s.push({mesh:e,baseX:e.position.x,baseY:e.position.y,depthFactor:s[s.length-1].depthFactor+n})}function ke(s,e,n,t,i){const a=new Float32Array([s.x,s.y,s.z,e.x,e.y,e.z,n.x,n.y,n.z,t.x,t.y,t.z]),o=new Float32Array([0,1,0,0,1,1,1,0]),r=[0,1,2,2,1,3],l=new k;return l.setAttribute("position",new f(a,3)),l.setAttribute("uv",new f(o,2)),l.setIndex(r),l.computeVertexNormals(),new R(l,i)}function j(s,e,n){const t=s.clone();return e.push(s),n.push(t),t}function Ce(s,e){for(let n=0;n<s.length;n++){const t=s[n],i=e[n];i.position.copy(t.position),i.rotation.copy(t.rotation),i.scale.copy(t.scale)}}class ze{constructor(e,n,t,i){this.scene=e,this.camera=n,this.sizes=t,this.config=i,this.layerGroup=new z,this.layers=[],this.textures={},this.textureLoader=new G,this.mask=null,this.clonedMask=null,this.maskMaterial=null,this.originalObjList=[],this.clonedObjList=[];const{width:a,height:o,ratio:r}=we(this.camera);this.planeWidth=a,this.planeHeight=o,this.ratio=r,console.log("LayerSystem initialized with ratio:",this.ratio)}async loadTextures(){const e=Object.entries(this.config.assets.textures).map(([n,t])=>new Promise((i,a)=>{this.textureLoader.load(t,o=>{be(o,this.planeWidth,this.planeHeight),this.textures[n]=o,console.log(`Texture loaded: ${n}`),i()},void 0,o=>{console.error(`Failed to load texture ${n}:`,o),a(o)})}));await Promise.all(e),console.log("All textures loaded")}createLayer(e,n,t,i=null){const{depthScale:a,scale:o,stencil:r,renderOrder:l}=t;let c=t.y;c===null&&i?c=i.position.y+t.yOffset:c===null&&(c=t.yOffset);const d=new Z(this.planeWidth,this.planeHeight*o,1),h=xe(this.ratio,n);h.stencilTest=!1;const m=new R(d,h);return m.position.set(0,c,t.z),m.renderOrder=l,r&&Se(h),this.layerGroup.add(m),L(this.layers,m,a),console.log(`Layer created: ${e} at y=${c}, z=${t.z}`),m}async createLayers(){await this.loadTextures(),this.scene.add(this.layerGroup);const e=this.config.layers.configs,n={};for(let t=0;t<e.length;t++){const i=e[t],a=this.textures[i.name];if(!a){console.warn(`Texture not found for layer: ${i.name}`);continue}const o=t>0?n[e[t-1].name]:null,r=this.createLayer(i.name,a,i,o);n[i.name]=r}this.oceanFrontLayer=n.oceanFront,this.oceanUnderTopLayer=n.oceanUnderTop,console.log("All layers created")}createStencilMask(e){if(!this.oceanFrontLayer||!this.oceanUnderTopLayer){console.error("oceanFront or oceanUnderTop layer not found");return}const n=this.oceanFrontLayer.position.y+this.planeHeight/2;this.maskMaterial=O(n,this.ratio),this.maskMaterial.stencilTest=!0;const t=this.oceanUnderTopLayer.position,i=this.config.mask.bounds,a=new y(-this.planeWidth,i.top,t.z+this.config.mask.zOffset),o=new y(-this.planeWidth,i.bottom,t.z+this.config.mask.zOffset),r=new y(this.planeWidth,i.top+this.planeHeight,t.z+this.config.mask.zOffset),l=new y(this.planeWidth,i.bottom,t.z+this.config.mask.zOffset);this.mask=ke(a,o,r,l,this.maskMaterial),this.mask.renderOrder=this.config.mask.renderOrder,L(this.layers,this.mask,0),this.layerGroup.add(this.mask),this.clonedMask=j(this.mask,this.originalObjList,this.clonedObjList),this.clonedMask.material=O(n,this.ratio,!0),e.add(this.clonedMask),console.log("Stencil mask created")}getLayers(){return this.layers}getMaskMaterial(){return this.maskMaterial}getClonedMask(){return this.clonedMask}getOriginalObjList(){return this.originalObjList}getClonedObjList(){return this.clonedObjList}getLayer(e){return this.layerGroup.children.find(n=>n.userData.name===e)}getOceanFrontLayer(){return this.oceanFrontLayer}getPlaneSize(){return{width:this.planeWidth,height:this.planeHeight,ratio:this.ratio}}dispose(){Object.values(this.textures).forEach(e=>{e.dispose()}),this.layers.forEach(e=>{e.mesh&&(e.mesh.geometry.dispose(),e.mesh.material.dispose())}),this.layerGroup.clear(),this.scene.remove(this.layerGroup),console.log("LayerSystem disposed")}}var Me=`uniform float time;\r
varying vec3 vColor;\r
attribute float id;

void main() {\r
    float brightness = abs(sin(time + id * 100.0)*3.0);\r
    vColor = vec3(brightness); 

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r
    
}`,Pe=`varying vec3 vColor;\r
void main() {\r
    gl_FragColor = vec4(1,1,1,1);\r
}`;class Oe{constructor(e,n,t){this.scene=e,this.sizes=n,this.config=t,this.starGroup=new z,this.stars=null,this.bubbles=null,this.width=n.width/n.height*10}createStars(){const e=this.config.particles.stars,n=e.count*Math.round(this.width),t=new Float32Array(n*3),i=new Float32Array(n);for(let r=0;r<n;r++){const l=(Math.random()-.5)*this.width*e.positionRange.x,c=(Math.random()-.5)*e.positionRange.y+e.positionRange.yOffset,d=(Math.random()-.5)*e.positionRange.z+e.positionRange.zOffset;t[r*3]=l,t[r*3+1]=c,t[r*3+2]=d,i[r]=r}const a=new k;a.setAttribute("position",new f(t,3)),a.setAttribute("id",new f(i,1));const o=new v({vertexShader:T.vertex,fragmentShader:T.fragment,uniforms:{time:{value:0}}});this.stars=new C(a,o),this.starGroup.add(this.stars),console.log(`Created ${n} stars`)}createBubbles(){const e=this.config.particles.bubbles,n=e.count,t=new Float32Array(n*3),i=new Float32Array(n),a=.22;for(let l=0;l<n;l++){const c=(Math.random()-.5)*this.width*e.positionRange.x,d=(Math.random()-1)*this.sizes.height*e.positionRange.y,h=a+.001;t[l*3]=c,t[l*3+1]=d,t[l*3+2]=h,i[l]=l}const o=new k;o.setAttribute("position",new f(t,3)),o.setAttribute("id",new f(i,1));const r=new v({vertexShader:Me,fragmentShader:Pe,uniforms:{time:{value:0}},depthTest:!1,depthWrite:!1,transparent:!0,stencilTest:!0,stencilFunc:J,stencilRef:1,stencilFuncMask:255,stencilFail:b,stencilZFail:b,stencilZPass:b});this.bubbles=new C(o,r),this.bubbles.renderOrder=2,this.scene.add(this.bubbles),console.log(`Created ${n} bubbles`)}async init(){this.createStars(),this.createBubbles(),this.scene.add(this.starGroup),console.log("ParticleSystem initialized")}getStars(){return this.stars}getStarGroup(){return this.starGroup}getBubbles(){return this.bubbles}update(e){this.stars&&(this.stars.material.uniforms.time.value=e),this.bubbles&&(this.bubbles.material.uniforms.time.value=e)}dispose(){this.stars&&(this.stars.geometry.dispose(),this.stars.material.dispose()),this.bubbles&&(this.bubbles.geometry.dispose(),this.bubbles.material.dispose()),this.starGroup.clear(),this.scene.remove(this.starGroup),this.bubbles&&this.scene.remove(this.bubbles),console.log("ParticleSystem disposed")}}class Te{constructor(e,n,t,i){this.scene=e,this.starGroup=n,this.sizes=t,this.config=i,this.gltfLoader=new K,this.teapots=[],this.width=t.width/t.height*10}async loadTeapots(){const e=this.config.particles.teapots,n=this.config.assets.models.teapot;return new Promise((t,i)=>{this.gltfLoader.load(n,a=>{console.log("Teapot model loaded");const o=new ye;a.scene.scale.set(e.scale,e.scale,e.scale),a.scene.position.set(0,0,0);const r=a.scene.children[0],l=new C(r.geometry,o);for(let c=0;c<e.count;c++){const d=(Math.random()-.5)*this.width*e.positionRange.x,h=(Math.random()-.5)*e.positionRange.y+e.positionRange.yOffset,m=(Math.random()-.5)*e.positionRange.z+e.positionRange.zOffset;l.position.set(d,h,m),l.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI);const x=l.clone();this.teapots.push(x),this.starGroup.add(x)}console.log(`Created ${e.count} teapot instances`),t()},void 0,a=>{console.error("Failed to load teapot model:",a),i(a)})})}async init(){await this.loadTeapots(),console.log("ModelLoader initialized")}getTeapots(){return this.teapots}update(e){for(const n of this.teapots)n.material&&n.material.uniforms&&(n.material.uniforms.time.value=e*.1)}dispose(){this.teapots.forEach(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()}),this.teapots=[],console.log("ModelLoader disposed")}}class Le{constructor(e,n,t,i,a,o){this.renderer=e,this.scene=n,this.camera=t,this.maskScene=i,this.maskCamera=a,this.config=o,this.effectComposer=null,this.distortPass=null,this.distortTexture=null}async loadDistortTexture(){return new Promise((e,n)=>{new G().load(this.config.assets.textures.distort,i=>{i.wrapS=S,i.wrapT=S,this.distortTexture=i,console.log("Distort texture loaded"),e()},void 0,i=>{console.error("Failed to load distort texture:",i),n(i)})})}async setup(e){await this.loadDistortTexture();const n={stencilBuffer:this.config.postProcessing.stencilBuffer},t=new Q(e.width,e.height,n);this.effectComposer=new ee(this.renderer,t),this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio,this.config.renderer.pixelRatio)),this.effectComposer.setSize(e.width,e.height);const i=new ne(this.scene,this.camera);this.effectComposer.addPass(i);const a=new te(this.maskScene,this.maskCamera);this.distortPass=new ie(ve(this.distortTexture)),this.distortPass.uniforms.bumpScale.value=this.config.postProcessing.distortion.bumpScale;const o=new se,r=new oe;this.effectComposer.addPass(a),this.effectComposer.addPass(this.distortPass),this.effectComposer.addPass(o),this.effectComposer.addPass(r),console.log("PostProcessing setup completed")}render(){this.effectComposer&&this.effectComposer.render()}updateTime(e){this.distortPass&&(this.distortPass.uniforms.time.value+=e)}resize(e){this.effectComposer&&(this.effectComposer.setSize(e.width,e.height),this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio,this.config.renderer.pixelRatio)))}dispose(){this.distortTexture&&this.distortTexture.dispose(),this.effectComposer&&this.effectComposer.dispose(),console.log("PostProcessing disposed")}}class Fe{constructor(e,n,t,i){this.clock=e,this.modules=n,this.sizes=t,this.config=i,this.previousTime=0,this.cursor={x:0,y:0},this.scrollY=0}handleScroll(e){this.scrollY=e;const n=this.modules.particleSystem.getStarGroup();n&&(n.position.y=e/this.sizes.height*this.config.animation.scrollSpeed.starGroup)}handleMouseMove(e){this.cursor.x=e.x,this.cursor.y=e.y}update(){const e=this.clock.getElapsedTime(),n=e-this.previousTime;this.previousTime=e;const t=this.modules.sceneSetup.getCamera();t&&(t.position.y=-this.scrollY/this.sizes.height*this.config.animation.scrollSpeed.camera);const i=this.cursor.x*this.config.animation.mouseCursor.base,a=-this.cursor.y*this.config.animation.mouseCursor.base+this.config.animation.mouseCursor.yOffset,o=this.modules.sceneSetup.getCameraGroup();o&&(o.position.x+=(i-o.position.x)*this.config.animation.smoothing*n,o.position.y+=(a-o.position.y)*this.config.animation.smoothing*n);const r=this.modules.layerSystem.getLayers();for(const u of r)u.mesh.material.uniforms&&(u.mesh.material.uniforms.time.value=e*u.depthFactor/this.config.animation.waveSpeed);const l=this.modules.layerSystem.getMaskMaterial(),c=this.modules.layerSystem.getClonedMask(),d=this.modules.layerSystem.getOceanFrontLayer(),{height:h}=this.modules.layerSystem.getPlaneSize();if(l&&c&&d){const u=this.findMaskLayerIndex(r),p=d.position.y+h/2,g=this.cursor.y*(r[u+1]?.depthFactor||0)*this.config.animation.cursorInfluence;c.material.uniforms.time.value=l.uniforms.time.value,l.uniforms.top.value=p-g,c.material.uniforms.top.value=p-g}this.modules.modelLoader&&this.modules.modelLoader.update(e),this.modules.particleSystem&&this.modules.particleSystem.update(e);const m=this.scrollY/this.sizes.height;r.forEach(u=>{const{mesh:p,depthFactor:g,baseX:U,baseY:E}=u;if(!p)return;const D=U+this.cursor.x*g*this.config.animation.parallaxStrength.mouse,I=E-this.cursor.y*g*this.config.animation.parallaxStrength.mouse+m*g*this.config.animation.parallaxStrength.scroll;p.position.x+=(D-p.position.x)*this.config.animation.smoothing*n,p.position.y+=(I-p.position.y)*this.config.animation.smoothing*n}),this.modules.postProcessing&&this.modules.postProcessing.updateTime(n);const x=this.modules.layerSystem.getOriginalObjList(),A=this.modules.layerSystem.getClonedObjList();Ce(x,A),this.modules.maskCamera&&t&&o&&this.modules.maskCamera.position.copy(t.position).add(o.position)}findMaskLayerIndex(e){return e.findIndex(n=>n.mesh.renderOrder===this.config.mask.renderOrder)}reset(){this.previousTime=0,this.cursor={x:0,y:0},this.scrollY=0}}class Re{constructor(){this.container=null,this.timelineData=[]}async init(e,n){if(this.container=document.querySelector(e),!this.container){console.error(`Timeline container not found: ${e}`);return}try{const t=await fetch(n);if(!t.ok)throw new Error(`Failed to load timeline data: ${t.statusText}`);this.timelineData=await t.json(),this.render(),this.initAnimations(),console.log(`Timeline rendered with ${this.timelineData.length} items`)}catch(t){console.error("Error initializing timeline:",t)}}render(){this.container.innerHTML="",this.timelineData.forEach(e=>{const n=this.createTimelineItem(e);this.container.appendChild(n)})}createTimelineItem(e){const n=document.createElement("div");n.className="timeline-item",n.id=e.id;const t=document.createElement("div");t.className="timeline-date",t.textContent=e.year;const i=document.createElement("div");i.className="timeline-content";const a=document.createElement("a");a.href=e.link,a.target="_blank",a.rel="noopener noreferrer";const o=document.createElement("img");o.src=e.image,o.alt=e.title,o.loading="lazy",a.appendChild(o);const r=document.createElement("div");r.className="timeline-text";const l=document.createElement("h2");l.textContent=e.title;const c=document.createElement("p");return c.textContent=e.description,r.appendChild(l),r.appendChild(c),i.appendChild(a),i.appendChild(r),n.appendChild(t),n.appendChild(i),n}addItem(e){this.timelineData.push(e);const n=this.createTimelineItem(e);this.container.appendChild(n),typeof gsap<"u"&&typeof ScrollTrigger<"u"&&gsap.to(n,{opacity:1,y:0,duration:1,scrollTrigger:{trigger:n,start:"top 90%",end:"top 50%",toggleActions:"play none none none"}})}removeItem(e){const n=this.timelineData.findIndex(t=>t.id===e);if(n!==-1){this.timelineData.splice(n,1);const t=document.getElementById(e);t&&t.remove()}}initAnimations(){if(typeof gsap>"u"){console.warn("GSAP is not loaded. Timeline animations will be disabled.");return}if(typeof ScrollTrigger>"u"){console.warn("ScrollTrigger is not loaded. Timeline animations will be disabled.");return}gsap.utils.toArray(".timeline-item").forEach(e=>{gsap.to(e,{opacity:1,y:0,duration:1,scrollTrigger:{trigger:e,start:"top 90%",end:"top 50%",toggleActions:"play none none none"}})}),console.log("Timeline scroll animations initialized")}updateData(e){this.timelineData=e,this.render(),this.initAnimations()}getData(){return this.timelineData}dispose(){typeof ScrollTrigger<"u"&&ScrollTrigger.getAll().forEach(e=>{e.trigger&&e.trigger.classList.contains("timeline-item")&&e.kill()}),this.container&&(this.container.innerHTML=""),this.timelineData=[],this.container=null,console.log("TimelineRenderer disposed")}}const Ge={assets:{textures:{sky:"/themes/ocean/textures/Sky.png",oceanEnd:"/themes/ocean/textures/OceanEnd.png",oceanFar:"/themes/ocean/textures/OceanFar.png",oceanMid:"/themes/ocean/textures/OceanMid.png",oceanNear:"/themes/ocean/textures/OceanNear.png",oceanFront:"/themes/ocean/textures/OceanFront.png",oceanUnderTop:"/themes/ocean/textures/UnderOceanTop.png",oceanUnderMid:"/themes/ocean/textures/UnderOceanMid.png",oceanUnderBot:"/themes/ocean/textures/UnderOceanBot.png",distort:"/themes/ocean/textures/oceanFlowMap.png"},models:{teapot:"/themes/ocean/models/teapotPC.glb"}},scene:{cameraFov:75,cameraY:4,cameraZ:3,backgroundColor:null},renderer:{alpha:!0,stencil:!0,pixelRatio:2,outputColorSpace:"linear-srgb"},layers:{layerDist:.02,verticalOffset:.01,configs:[{name:"sky",y:-4,yOffset:0,z:0,depthScale:1,scale:1,stencil:!1,renderOrder:0},{name:"oceanEnd",y:null,yOffset:-.8,z:.02,depthScale:1,scale:1,stencil:!1,renderOrder:0},{name:"oceanFar",y:null,yOffset:.01,z:.04,depthScale:1,scale:1,stencil:!1,renderOrder:0},{name:"oceanMid",y:null,yOffset:.01,z:.06,depthScale:1,scale:1,stencil:!1,renderOrder:0},{name:"oceanNear",y:null,yOffset:.01,z:.08,depthScale:1,scale:1,stencil:!1,renderOrder:0},{name:"oceanFront",y:null,yOffset:.01,z:.1,depthScale:1,scale:1,stencil:!1,renderOrder:0},{name:"oceanUnderTop",y:null,yOffset:.9+.01,z:.22,depthScale:1,scale:1,stencil:!0,renderOrder:2},{name:"oceanUnderMid",y:null,yOffset:-.3+.01,z:.12,depthScale:-.2,scale:1,stencil:!0,renderOrder:2},{name:"oceanUnderBot",y:null,yOffset:-.3+.01,z:.11,depthScale:-4,scale:8,stencil:!0,renderOrder:2}]},mask:{zOffset:.02,renderOrder:1,bounds:{left:-1e3,right:1e3,top:1e3,bottom:-1e3}},particles:{stars:{count:50,positionRange:{x:8,y:.5,yOffset:15,z:10,zOffset:-20}},teapots:{count:10,scale:.1,positionRange:{x:8,y:.5,yOffset:15,z:10,zOffset:-20}},bubbles:{count:4e3,positionRange:{x:8,y:5,z:10,zOffset:-20}}},postProcessing:{distortion:{bumpScale:.008},stencilBuffer:!0},animation:{parallaxStrength:{mouse:.2,scroll:.5},smoothing:5,waveSpeed:128,cursorInfluence:.05,scrollSpeed:{camera:5,starGroup:20},mouseCursor:{base:.5,yOffset:-.25}}},je=`<div class="hero-header">
    <div class="wrapper">
        <header>
            <div class="logo">
                <i class="fa-solid custom-s"></i>
                <div class="logo-text">Shu Chen</div>
            </div>
            <nav>
                <div class="togglebtn">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>
        </header>
        <div class="container">
            <div class="hero-pic">
                <img src="/images/main_photo.JPG" alt="profile pic">
            </div>
            <div class="hero-text">
                <h5>Hi I'm <span class="input"></span></h5>
                <h1>Shu Chen</h1>
                <p> I am a student at the University of Utah with a passion for solving problems and creating fun projects.
                    In my free time, I enjoy cooking and playing Apex Legends, besides coding.
                </p>

                <div class="btn-group">
                  <a href="cv.html" class="btn active"> Resume</a>
                  <a href="note.html" class="btn active"> Notes</a>
                </div>

                <div class="social">
                    <a href="https://www.linkedin.com/in/%E6%A0%91-%E9%99%88-89a32b34b/"><i class="fa-brands fa-linkedin"></i></a>
                </div>
            </div>
        </div>
    </div>
    <!--LOGOS-->
    <div class="skills-section">
        <div class="category">
            <h3>Programming Languages</h3>
            <div class="icons">
                <img src="/images/Skills/Python.svg" alt="Python">
                <img src="/images/Skills/rust.png" alt="rust">
                <img src="/images/Skills/CSharp.png" alt="C#">
                <img src="/images/Skills/c.png" alt="C">
                <img src="/images/Skills/cpp.png" alt="C++">
                <img src="/images/Skills/js.png" alt="JavaScript">
            </div>
            <div class="icons">
                <img src="/images/Skills/mysql.png" alt="SQL">
                <img src="/images/Skills/java.png" alt="JAVA">
                <img src="/images/Skills/glsl.svg" alt="GLSL">
            </div>
        </div>
        <div class="category">
            <h3>Programs I Use</h3>
            <div class="icons">
                <img src="/images/Skills/vsc.png" alt="VScode">
                <img src="/images/Skills/docker.svg" alt="Docker">
                <img src="/images/Skills/github.svg" alt="Github">
                <img src="/images/Skills/adobe.svg" alt="PS,PR,AE,Pt...">
                <img src="/images/Skills/houdini.png" alt="Houdini">
                <img src="/images/Skills/ue.png" alt="Unreal">
                <img src="/images/Skills/unity.png" alt="Unity">
                <img src="/images/Skills/obsidian.png" alt="Obsidian">
            </div>
        </div>
    </div>

    <!-- 时间轴 -->
    <!-- Timeline items will be dynamically generated by TimelineRenderer.js -->
    <section class="timeline" id="timeline-container"></section>
</div>

<!-- Typed.js for typing text effect -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.10/typed.min.js"><\/script>
<script>
    // Creating button click show hide navbar
    var togglebtn = document.querySelector(".togglebtn");
    var nav = document.querySelector(".navlinks");
    var links = document.querySelector(".navlinks li");

    if (togglebtn) {
        togglebtn.addEventListener("click", function(){
            this.classList.toggle("click");
            if (nav) nav.classList.toggle("open");
        });
    }

    // Typed.js initialization
    var typed = new Typed(".input", {
        strings: ["Game Developer", "VFX Designer", "Software Developer", "Student"],
        typedSpeed: 70,
        backSpeed: 55,
        loop: true
    });
<\/script>

<!-- GSAP and ScrollTrigger -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"><\/script>
<!-- Timeline animations are initialized by TimelineRenderer after DOM elements are created -->
`,Ae=`/**
 * Ocean Theme Specific Styles
 * 所有 Ocean 主题专属的样式
 */

/* HTML 和 Body 设置 */
html,
body {
    height: 4000px; /* 比屏幕高很多，支持滚动视差 */
    overflow: visible; /* 允许滚动 */
}

/* 背景渐变（Ocean 主题特定） */
.background {
    position: absolute; /* 随页面滚动 */
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%; /* 覆盖整个页面高度 */
    background: linear-gradient(to bottom,#000312 10%,#0c1541 35vh,#1db6e5 75vh,#1db6e5);
    z-index: -1; /* 放在最底下，确保在 Canvas 后面 */
    pointer-events: none; /* 背景不能挡住鼠标点击 */
}

/* 页面内容容器 */
.page-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
}

/* Hero 区域 */
.hero-header{
    width:100%;
    height: 100%;
    min-height: 100vh;
}

.wrapper{
    width:1280px;
    max-width: 95%;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header 导航 */
header{
    padding: 40px 0 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

.logo{
    display: inline-flex;
    justify-content: center;
    align-items: center;
}

.logo i{
    height: 45px;
    width:45px;
    background-color: #007ced;
    border-radius: 50%;
    color:#fff;
    font-weight: 700;
    font-size: 1.5rem;
    padding: 10px;
    margin-right: 5px;
    cursor: pointer;
    text-align: center;
}

.logo .logo-text{
    font-size: 24px;
    font-weight: 500;
    color:#fff;
}

nav .togglebtn{
    width: 35px;
    height: 35px;
    position: absolute;
    top:45px;
    right: 3%;
    z-index: 5;
    cursor: pointer;
    display: none;
}

nav .togglebtn span{
    display: block;
    background-color: #007ced;
    margin: 5px 0px;
    width:100%;
    height:3px;
    transition: 0.3s;
    transition-property: transform, opacity;
}

nav .navlinks{
    list-style-type: none;
}

nav .navlinks li{
    display: inline-block;
}

nav .navlinks li a{
    color:#e5e5e5;
    margin-right: 2.5rem;
}

/* Hero 内容区 */
.container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-top:4rem;
}

.container .hero-pic{
    width: 300px;
    max-width: 90vw;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    overflow: hidden;
    border: 15px solid #444;
    box-shadow: 5px 7px 25px rgba(0,0,0,0.5);
    flex-shrink: 0;
}

.hero-pic img{
    height: 100%;
    width:100%;
    object-fit: cover;
    transition: 0.5s;
}

.hero-pic img:hover{
    transform: scale(1.2);
}

.hero-text{
    max-width: 500px;
    display: flex;
    flex-direction: column;
}

.hero-text h5{
    color:#e5e5e5;
    font-size: 14px;
}

.hero-text h5 span{
    color:#007ced;
    font-size: 16px;
}

.hero-text h1{
    color: #007ced;
    font-size: 3rem;
}

.hero-text p{
    color:#e5e5e5;
}

/* 按钮组 */
.btn-group{
    margin:45px 0;
}

.btn-group .btn{
    border-color: #d5d5d5;
    color:#fff;
    background-color: #333;
    padding: 12px 25px;
    margin: 5px 0px;
    margin-right:7px;
    border-radius: 30px;
    border:2px solid #e5e5e5;
    box-shadow: 0 10px 10px -8px rgb(0 0 0 / 78%);
}

.btn.active{
    border-color: #007ced;
}

/* 社交图标 */
.hero-text .social i{
    color: #e5e5e5;
    font-size: 18px;
    margin-right: 10px;
    transition: 0.5s;
}

.hero-text .social i:hover{
    color:#007ced;
    transform: rotate(360deg);
}

/* 自定义 Logo 字母 */
.custom-s::before {
    content: "S";
    font-family: Arial, sans-serif;
    font-weight: bold;
}

/* 技能区域 */
.skills-section {
    text-align: center;
    margin: 50px auto;
    width: 60%;
}

.category h3 {
    margin-top: 30px;
    color: #e5e5e5;
    font-size: 24px;
    margin-bottom: 30px;
}

.category h4 {
    margin-top: -20px;
    color: #898989;
    font-size: 10px;
    margin-bottom: 30px;
}

.icons {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.icons img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    transition: transform 0.3s ease-in-out;
}

.icons img:hover {
    transform: scale(1.2);
}

/* 时间轴 */
.timeline {
    width: 80%;
    max-width: 1200px;
    margin: 1px auto;
    position: relative;
}

.timeline-item {
    opacity: 0; /* 初始隐藏，由 GSAP 动画显示 */
    display: flex;
    align-items: center;
    margin-top: 80px;
    transform: translateY(50px);
    position: relative;
}

/* 左侧：时间（占 1 份） */
.timeline-date {
    flex: 1;
    font-size: 24px;
    font-weight: bold;
    color: #a9a9a9;
    text-align: right;
    padding-right: 20px;
    min-width: 80px;
}

/* 中间：竖线 */
.timeline-item::before {
    content: "";
    position: relative;
    width: 2px;
    min-height: 100%;
    background-color: #ccc;
    margin: 0 20px;
    flex-shrink: 0;
}

/* 右侧：内容（占 4 份） */
.timeline-content {
    flex: 4;
    display: flex;
    align-items: center;
    gap: 20px;
    min-width: 0;
}

.timeline-content a {
    width: 200px;
    aspect-ratio: 4 / 3;
    display: block;
    overflow: hidden;
    border-radius: 10px;
    flex-shrink: 0;
}

.timeline-content img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: 0.5s ease-in-out;
}

.timeline-content a:hover img {
    filter: blur(5px);
    transform: scale(1.1);
}

.timeline-text {
    max-width: 500px;
}

.timeline-text h2 {
    font-size: 26px;
    color: #18c7f9;
    margin-bottom: 10px;
}

.timeline-text p {
    font-size: 16px;
    color: #e5e5e5;
}

/* 响应式设计 - 小屏幕导航 */
@media(max-width:930px) {
    nav .togglebtn{
        display: initial;
    }

    .click {
        top:45px;
    }

    .click span{
        position: absolute;
        margin-top:12px
    }

    .click span:first-child{
        transform: rotate(-40deg);
    }

    .click span:nth-child(2) {
        opacity: 0;
        margin:0;
    }

    .click span:last-child{
        transform: rotate(45deg);
        top:0;
    }

    nav .navlinks{
        position: absolute;
        top:110px;
        right:-100%;
        bottom: 0;
        width: 60%;
        height: 100vh;
        background-color: #222;
        z-index: 3;
        box-shadow: 5px 13px 30px rgba(0,0,0,0.1);
        transition: 0.5s;
        padding: 25px 0px;
    }

    nav .navlinks li{
        display: block;
    }

    nav .navlinks li a{
        display: block;
        margin-bottom: 15px;
        text-align: center;
    }

    nav .navlinks.open{
        right:0;
    }
}

/* 响应式设计 - 桌面端缩小时的调整 */
@media(max-width:1200px) {
    .timeline {
        width: 85%;
    }

    .timeline-content a {
        width: 180px;
    }

    .timeline-text {
        max-width: 400px;
    }
}

/* 响应式设计 - 中等屏幕 */
@media(max-width:1024px) {
    .timeline {
        width: 90%;
    }

    .timeline-date {
        font-size: 20px;
        padding-right: 15px;
    }

    .timeline-item::before {
        margin: 0 15px;
    }

    .timeline-content a {
        width: 160px;
    }

    .timeline-text {
        max-width: 350px;
    }
}

/* 响应式设计 - 小屏（年份缩小，但保持横向布局） */
@media(max-width:900px) {
    .timeline-date {
        font-size: 18px;
        min-width: 60px;
    }

    .timeline-content a {
        width: 140px;
    }
}

/* 响应式设计 - 移动端布局 */
@media(max-width:768px) {
    .container{
        flex-direction: column;
        padding-top:2rem
    }

    .hero-pic {
        width: 250px;
        max-width: 80vw;
    }

    .hero-text{
        padding:40px 0px;
    }

    .timeline {
        width: 95%;
    }

    .timeline-item {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    /* 隐藏年份和竖线 */
    .timeline-date {
        display: none;
    }

    .timeline-item::before {
        display: none;
    }

    /* 内容区域填满宽度 */
    .timeline-content {
        flex: none;
        width: 100%;
        flex-direction: column;
        align-items: center;
        text-align: left;
    }

    .timeline-content a {
        width: 100%;
        max-width: 400px;
        aspect-ratio: 4 / 3;
        align-self: center;
        margin-bottom: 20px;
    }

    .timeline-text {
        max-width: 100%;
        padding: 0 5%;
        width: 100%;
    }
}

/* 响应式设计 - 更窄的屏幕（强制图片在上方，确保不变形） */
@media(max-width:500px) {
    .hero-pic {
        width: 200px;
        max-width: 70vw;
        border: 10px solid #444;
    }

    .timeline-content a {
        width: calc(100% - 20px);
        max-width: 350px;
        min-width: 200px;
    }

    .timeline-text h2 {
        font-size: 22px;
    }

    .timeline-text p {
        font-size: 14px;
    }
}

/* 响应式设计 - 极窄屏幕（图片进一步缩小但保持比例） */
@media(max-width:350px) {
    .hero-pic {
        width: 180px;
        max-width: 65vw;
        border: 8px solid #444;
    }

    .timeline {
        width: 95%;
    }

    .timeline-content a {
        width: 100%;
        min-width: 150px;
        max-width: 280px;
    }

    .timeline-text h2 {
        font-size: 20px;
    }

    .timeline-text p {
        font-size: 13px;
    }
}
`;class Ue extends M{constructor(e,n){super(e,n),this.config=Ge,this.modules={},this.maskScene=null,this.maskCamera=null,this.requiresReloadOnResize=!0,this.resizeReloadDelay=500}async init(){try{this.modules.sceneSetup=new ae(this.canvas,this.sizes,this.config);const{scene:e,camera:n,renderer:t,cameraGroup:i}=this.modules.sceneSetup.setup();this.scene=e,this.camera=n,this.renderer=t,this.cameraGroup=i,this.maskScene=new F,this.maskCamera=j(this.camera,[],[]),this.maskScene.add(this.maskCamera),this.modules.layerSystem=new ze(this.scene,this.camera,this.sizes,this.config),await this.modules.layerSystem.createLayers(),this.modules.layerSystem.createStencilMask(this.maskScene),this.modules.particleSystem=new Oe(this.scene,this.sizes,this.config),await this.modules.particleSystem.init();const a=this.modules.particleSystem.getStarGroup();this.modules.modelLoader=new Te(this.scene,a,this.sizes,this.config),await this.modules.modelLoader.init(),this.modules.postProcessing=new Le(this.renderer,this.scene,this.camera,this.maskScene,this.maskCamera,this.config),await this.modules.postProcessing.setup(this.sizes),this.modules.animationController=new Fe(this.clock,this.modules,this.sizes,this.config),this.modules.maskCamera=this.maskCamera,this.isInitialized=!0}catch(e){throw console.error("Failed to initialize Ocean theme:",e),e}}tick(){this.isInitialized&&(this.modules.animationController.update(),this.modules.postProcessing.render())}resize(e){this.sizes=e,this.modules.sceneSetup&&this.modules.sceneSetup.resize(e),this.modules.postProcessing&&this.modules.postProcessing.resize(e)}onScroll(e){this.modules.animationController&&this.modules.animationController.handleScroll(e)}onMouseMove(e){this.modules.animationController&&this.modules.animationController.handleMouseMove(e)}async onContentReady(){this.modules.timelineRenderer=new Re,await this.modules.timelineRenderer.init("#timeline-container","/themes/ocean/timeline-data.json")}dispose(){this.modules.timelineRenderer&&this.modules.timelineRenderer.dispose(),this.modules.postProcessing&&this.modules.postProcessing.dispose(),this.modules.modelLoader&&this.modules.modelLoader.dispose(),this.modules.particleSystem&&this.modules.particleSystem.dispose(),this.modules.layerSystem&&this.modules.layerSystem.dispose(),this.modules.sceneSetup&&this.modules.sceneSetup.dispose(),this.maskScene&&this.maskScene.clear(),this.isInitialized=!1}static getMetadata(){return{id:"ocean",name:"Ocean Parallax",description:"Multi-layer ocean scene with particles, underwater effects, and parallax scrolling",author:"Shu Chen",complexity:"high",htmlContent:je,styles:Ae}}}const De=Object.freeze(Object.defineProperty({__proto__:null,default:Ue},Symbol.toStringTag,{value:"Module"}));export{M as B,De as i};
