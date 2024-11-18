(function(){"use strict";var e={7686:function(e,t,a){var i=a(5130),o=a(6768);const r={id:"app"};function s(e,t,a,i,s,n){const d=(0,o.g2)("router-view");return(0,o.uX)(),(0,o.CE)("div",r,[(0,o.bF)(d)])}var n={name:"App"},d=a(1241);const l=(0,d.A)(n,[["render",s],["__scopeId","data-v-83f06f9c"]]);var c=l,h=a(1387),g=a(4232);const m={class:"media-upload"},u={class:"upload-section"},p={class:"custom-file-input"},f={key:0,class:"processing-message"},v={key:1,class:"error"};function k(e,t,a,i,r,s){return(0,o.uX)(),(0,o.CE)("div",m,[t[4]||(t[4]=(0,o.Lk)("h1",{class:"project-title"},"🌊 Synchronous Haptics Grid Mapping from Top-down Videos and Images of Water Surface",-1)),t[5]||(t[5]=(0,o.Lk)("p",{class:"project-description"}," This project presents a method for analyzing water waves in video and image footage to simulate the tactile sensations one would experience by haptic expressions on their hand. The primary goal is to track the progression of a wave and continuously calculate its intensity. ",-1)),t[6]||(t[6]=(0,o.Lk)("a",{href:"https://github.com/BaturayOnural/haptics-surface-grid",target:"_blank",class:"github-link"},[(0,o.Lk)("img",{src:"https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",alt:"GitHub Logo",class:"github-logo"}),(0,o.eW)(" View Project on GitHub ")],-1)),(0,o.Lk)("div",u,[t[3]||(t[3]=(0,o.Lk)("h2",null,"Upload Media",-1)),(0,o.Lk)("div",p,[(0,o.Lk)("button",{onClick:t[0]||(t[0]=(...e)=>s.triggerFileSelect&&s.triggerFileSelect(...e)),class:"upload-btn"},"Select Media"),(0,o.Lk)("input",{type:"file",ref:"fileInput",onChange:t[1]||(t[1]=(...e)=>s.handleFileUpload&&s.handleFileUpload(...e)),accept:"video/*,image/*",style:{display:"none"}},null,544)]),r.isProcessing?((0,o.uX)(),(0,o.CE)("div",f,t[2]||(t[2]=[(0,o.Lk)("p",null,"⏳ Processing...",-1)]))):(0,o.Q3)("",!0),r.errorMessage?((0,o.uX)(),(0,o.CE)("p",v,(0,g.v_)(r.errorMessage),1)):(0,o.Q3)("",!0)])])}a(4114),a(4603),a(7566),a(8721);var y=a(4373),b=a(782),w={name:"MediaUpload",computed:{...(0,b.L8)(["getMediaFilename","getDataFilename"])},data(){return{errorMessage:"",isProcessing:!1}},methods:{triggerFileSelect(){this.$refs.fileInput.click()},handleFileUpload(e){const t=e.target.files[0];if(t){if(t.size>104857600)return void(this.errorMessage="File size exceeds 100MB. Please select a smaller file.");const e=t.type;if(e.startsWith("video")){const e=document.createElement("video");e.preload="metadata",e.src=URL.createObjectURL(t),e.onloadedmetadata=()=>{if(e.duration>30)this.errorMessage="Video duration exceeds 30 seconds. Please select a shorter video.";else{this.errorMessage="",this.isProcessing=!0;const e=new FormData;e.append("file",t),y.A.post("/api/upload",e).then((e=>{const{filename:t,data_filename:a,type:i}=e.data;this.$store.commit("setMediaFilename",t),this.$store.commit("setDataFilename",a),this.isProcessing=!1,"video"===i?this.$router.push("/video-playback"):"image"===i?this.$router.push("/image-playback"):this.errorMessage="Unsupported media type."})).catch((e=>{this.errorMessage="An error occurred while uploading the media. Please try again.",console.error(e),this.isProcessing=!1}))}},e.onerror=()=>{this.errorMessage="Invalid media file. Please select a valid video or image."}}else if(e.startsWith("image")){this.errorMessage="",this.isProcessing=!0;const e=new FormData;e.append("file",t),y.A.post("/api/upload",e).then((e=>{const{filename:t,data_filename:a,type:i}=e.data;this.$store.commit("setMediaFilename",t),this.$store.commit("setDataFilename",a),this.isProcessing=!1,"video"===i?this.$router.push("/video-playback"):"image"===i?this.$router.push("/image-playback"):this.errorMessage="Unsupported media type."})).catch((e=>{this.errorMessage="An error occurred while uploading the media. Please try again.",console.error(e),this.isProcessing=!1}))}else this.errorMessage="Unsupported file type. Please upload a video or image."}}}};const C=(0,d.A)(w,[["render",k],["__scopeId","data-v-68931374"]]);var L=C;const F={class:"video-playback"},M={class:"content-container"},D={class:"main-content"},I={class:"frame-container"},x={class:"frame-info"},S={class:"frame-title"},T={class:"time-display"},E={ref:"canvas",class:"frame-image"},P=["disabled"],_={class:"grid-container"},R=["disabled"],$={class:"legend"},O={ref:"legendCanvas",class:"legend-bar"};function A(e,t,a,i,r,s){return(0,o.uX)(),(0,o.CE)("div",F,[(0,o.Lk)("button",{onClick:t[0]||(t[0]=(...e)=>s.goHome&&s.goHome(...e)),class:"home-button"},"Home"),t[6]||(t[6]=(0,o.Lk)("h1",{class:"page-title"},"🎥 Video Analysis",-1)),(0,o.Lk)("div",M,[(0,o.Lk)("div",D,[(0,o.Lk)("div",I,[(0,o.Lk)("div",x,[(0,o.Lk)("div",S,"Frame ("+(0,g.v_)(r.frameIndex+1)+"/"+(0,g.v_)(r.totalFrames)+")",1),(0,o.Lk)("div",T,"Time: "+(0,g.v_)(r.currentTimestamp)+" ms",1)]),(0,o.Lk)("canvas",E,null,512),(0,o.Lk)("button",{onClick:t[1]||(t[1]=(...e)=>s.previousFrame&&s.previousFrame(...e)),disabled:0===r.frameIndex,class:"nav-button"},"Previous Frame",8,P)]),(0,o.Lk)("div",_,[t[4]||(t[4]=(0,o.Lk)("div",{class:"grid-title"},"Wave Intensity Grid",-1)),(0,o.Lk)("div",{class:"grid",style:(0,g.Tr)({gridTemplateColumns:"repeat("+r.gridCols+", 1fr)",gridTemplateRows:"repeat("+r.gridRows+", 1fr)"})},[((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)(r.currentGridData,((e,t)=>((0,o.uX)(),(0,o.CE)("div",{key:t,style:(0,g.Tr)({backgroundColor:s.getInterpolatedColor(e)}),class:"grid-cell"},null,4)))),128))],4),(0,o.Lk)("button",{onClick:t[2]||(t[2]=(...e)=>s.nextFrame&&s.nextFrame(...e)),disabled:r.frameIndex>=r.totalFrames-1,class:"nav-button"},"Next Frame",8,R)])]),(0,o.Lk)("div",$,[t[5]||(t[5]=(0,o.Lk)("h4",null,"Intensity Legend",-1)),(0,o.Lk)("canvas",O,null,512)]),(0,o.Lk)("button",{onClick:t[3]||(t[3]=(...e)=>s.downloadIntensityData&&s.downloadIntensityData(...e)),class:"download-button"},"Download Intensity Data")])])}a(1454);var j={name:"VideoPlayback",computed:{...(0,b.L8)(["getMediaFilename","getDataFilename"])},data(){return{frameIndex:0,framesData:[],currentGridData:[],currentTimestamp:0,video:null,isVideoLoaded:!1,gridRows:0,gridCols:0,totalFrames:0,errorMessage:"",onVideoSeeked:null}},methods:{fetchData(){const e=this.getMediaFilename,t=this.getDataFilename;if(!e||!t)return console.error("Media or data filename is missing."),void(this.errorMessage="Media or data filename is missing.");const a=`/api/media/${e}`;this.video=document.createElement("video"),this.video.crossOrigin="anonymous",this.video.src=a,this.video.onloadeddata=()=>{this.isVideoLoaded=!0,this.captureFrame()},this.video.onerror=()=>{console.error("Error loading video."),this.errorMessage="Error loading video."},y.A.get(`/api/data/${t}`).then((e=>{const t=e.data;this.framesData=t.intensity_matrices,this.gridRows=t.grid_rows,this.gridCols=t.grid_cols,this.totalFrames=this.framesData.length,this.updateFrame(0),this.drawLegend()})).catch((e=>{console.error("Error fetching intensity data:",e),this.errorMessage="Error fetching intensity data."}))},updateFrame(e){this.frameIndex=e,this.currentGridData=this.framesData[e].intensity_grid.flat(),this.currentTimestamp=this.framesData[e].timestamp_ms,this.captureFrame()},getInterpolatedColor(e){return e<=.2?this.interpolateColor([0,0,139],[0,0,255],e/.2):e<=.4?this.interpolateColor([0,0,255],[0,255,255],(e-.2)/.2):e<=.6?this.interpolateColor([0,255,255],[255,255,0],(e-.4)/.2):e<=.8?this.interpolateColor([255,255,0],[255,165,0],(e-.6)/.2):this.interpolateColor([255,165,0],[139,0,0],(e-.8)/.2)},interpolateColor(e,t,a){const i=e.map(((e,i)=>Math.round(e+a*(t[i]-e))));return`rgb(${i[0]}, ${i[1]}, ${i[2]})`},captureFrame(){if(this.isVideoLoaded){const e=this.$refs.canvas,t=e.getContext("2d");e.width=640,e.height=360;const a=150,i=this.frameIndex*a/1e3;if(i>this.video.duration)return void console.error("Frame time exceeds video duration.");this.onVideoSeeked&&this.video.removeEventListener("seeked",this.onVideoSeeked),this.onVideoSeeked=()=>{t.drawImage(this.video,0,0,e.width,e.height),this.drawGridLines(t,e.width,e.height),this.video.removeEventListener("seeked",this.onVideoSeeked),this.onVideoSeeked=null},this.video.addEventListener("seeked",this.onVideoSeeked),this.video.currentTime=i}},drawGridLines(e,t,a){e.strokeStyle="white",e.lineWidth=1;for(let i=1;i<this.gridCols;i++)e.beginPath(),e.moveTo(i*t/this.gridCols,0),e.lineTo(i*t/this.gridCols,a),e.stroke();for(let i=1;i<this.gridRows;i++)e.beginPath(),e.moveTo(0,i*a/this.gridRows),e.lineTo(t,i*a/this.gridRows),e.stroke()},drawLegend(){const e=this.$refs.legendCanvas,t=e.getContext("2d"),a=window.devicePixelRatio||1,i=300,o=60;e.width=i*a,e.height=o*a,t.scale(a,a);const r=260,s=20;t.clearRect(0,0,i,o);const n=t.createLinearGradient(s,0,s+r,0);n.addColorStop(0,"DarkBlue"),n.addColorStop(.2,"Blue"),n.addColorStop(.4,"Cyan"),n.addColorStop(.6,"Yellow"),n.addColorStop(.8,"Orange"),n.addColorStop(1,"DarkRed"),t.fillStyle=n,t.fillRect(s,20,r,20);const d=[0,.2,.4,.6,.8,1];d.forEach(((e,a)=>{const i=s+a*(r/(d.length-1));t.strokeStyle="black",t.lineWidth=1,t.beginPath(),t.moveTo(i,40),t.lineTo(i,50),t.stroke(),t.fillStyle="black",t.font="12px Arial",t.textAlign="center",t.textBaseline="top",t.fillText(e.toFixed(1),i,52)}))},previousFrame(){this.frameIndex>0&&this.updateFrame(this.frameIndex-1)},nextFrame(){this.frameIndex<this.totalFrames-1?this.updateFrame(this.frameIndex+1):console.log("No more frames.")},goHome(){this.$router.push("/")},downloadIntensityData(){const e=this.getDataFilename;if(!e)return console.error("Data filename is missing."),void(this.errorMessage="Data filename is missing.");const t=`/api/data/${e}`;y.A.get(t,{responseType:"blob"}).then((t=>{const a=new Blob([t.data],{type:"application/json"}),i=URL.createObjectURL(a),o=document.createElement("a");o.href=i,o.setAttribute("download",e),document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(i)})).catch((e=>{console.error("Error downloading intensity data:",e),this.errorMessage="Error downloading intensity data."}))}},mounted(){this.fetchData()}};const U=(0,d.A)(j,[["render",A],["__scopeId","data-v-f9d1238a"]]);var V=U;const G={class:"image-playback"},H={class:"content-container"},B={class:"main-content"},W={class:"media-container"},X={ref:"canvas",class:"media-canvas"},z={class:"grid-container"},K={class:"legend"},N={ref:"legendCanvas",class:"legend-bar"};function Q(e,t,a,i,r,s){return(0,o.uX)(),(0,o.CE)("div",G,[(0,o.Lk)("button",{onClick:t[0]||(t[0]=(...e)=>s.goHome&&s.goHome(...e)),class:"home-button"},"Home"),t[5]||(t[5]=(0,o.Lk)("h1",{class:"page-title"},"🖼️ Image Analysis",-1)),(0,o.Lk)("div",H,[(0,o.Lk)("div",B,[(0,o.Lk)("div",W,[t[2]||(t[2]=(0,o.Lk)("div",{class:"media-info"},[(0,o.Lk)("div",{class:"media-title"},"Frame")],-1)),(0,o.Lk)("canvas",X,null,512)]),(0,o.Lk)("div",z,[t[3]||(t[3]=(0,o.Lk)("div",{class:"grid-title"},"Wave Intensity Grid",-1)),(0,o.Lk)("div",{class:"grid",style:(0,g.Tr)({gridTemplateColumns:"repeat("+r.gridCols+", 1fr)",gridTemplateRows:"repeat("+r.gridRows+", 1fr)"})},[((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)(r.gridData,((e,t)=>((0,o.uX)(),(0,o.CE)("div",{key:t,style:(0,g.Tr)({backgroundColor:s.getInterpolatedColor(e)}),class:"grid-cell"},null,4)))),128))],4)])]),(0,o.Lk)("div",K,[t[4]||(t[4]=(0,o.Lk)("h4",null,"Intensity Legend",-1)),(0,o.Lk)("canvas",N,null,512)]),(0,o.Lk)("button",{onClick:t[1]||(t[1]=(...e)=>s.downloadIntensityData&&s.downloadIntensityData(...e)),class:"download-button"},"Download Intensity Data")])])}var Y={name:"ImagePlayback",computed:{...(0,b.L8)(["getMediaFilename","getDataFilename"])},data(){return{gridData:[],gridRows:0,gridCols:0,errorMessage:"",isMediaLoaded:!1}},methods:{fetchData(){const e=this.getMediaFilename,t=this.getDataFilename;if(!e)return console.error("Media filename is missing."),void(this.errorMessage="Media filename is missing.");const a=`/api/media/${e}`;this.loadImage(a),t&&y.A.get(`/api/data/${t}`).then((e=>{const t=e.data;this.gridData=t.intensity_matrices[0].intensity_grid.flat(),this.gridRows=t.grid_rows,this.gridCols=t.grid_cols,this.drawLegend()})).catch((e=>{console.error("Error fetching intensity data:",e),this.errorMessage="Error fetching intensity data."}))},loadImage(e){const t=new Image;t.crossOrigin="anonymous",t.src=e,t.onload=()=>{this.isMediaLoaded=!0,this.drawImage(t)},t.onerror=()=>{console.error("Error loading image."),this.errorMessage="Error loading image."}},drawImage(e){const t=this.$refs.canvas,a=t.getContext("2d");t.width=640,t.height=360,a.drawImage(e,0,0,t.width,t.height),this.drawGridLines(a,t.width,t.height)},getInterpolatedColor(e){return e<=.2?this.interpolateColor([0,0,139],[0,0,255],e/.2):e<=.4?this.interpolateColor([0,0,255],[0,255,255],(e-.2)/.2):e<=.6?this.interpolateColor([0,255,255],[255,255,0],(e-.4)/.2):e<=.8?this.interpolateColor([255,255,0],[255,165,0],(e-.6)/.2):this.interpolateColor([255,165,0],[139,0,0],(e-.8)/.2)},interpolateColor(e,t,a){const i=e.map(((e,i)=>Math.round(e+a*(t[i]-e))));return`rgb(${i[0]}, ${i[1]}, ${i[2]})`},drawGridLines(e,t,a){e.strokeStyle="white",e.lineWidth=1;for(let i=1;i<this.gridCols;i++)e.beginPath(),e.moveTo(i*t/this.gridCols,0),e.lineTo(i*t/this.gridCols,a),e.stroke();for(let i=1;i<this.gridRows;i++)e.beginPath(),e.moveTo(0,i*a/this.gridRows),e.lineTo(t,i*a/this.gridRows),e.stroke()},drawLegend(){const e=this.$refs.legendCanvas,t=e.getContext("2d"),a=window.devicePixelRatio||1,i=300,o=60;e.width=i*a,e.height=o*a,t.scale(a,a);const r=260,s=20;t.clearRect(0,0,i,o);const n=t.createLinearGradient(s,0,s+r,0);n.addColorStop(0,"DarkBlue"),n.addColorStop(.2,"Blue"),n.addColorStop(.4,"Cyan"),n.addColorStop(.6,"Yellow"),n.addColorStop(.8,"Orange"),n.addColorStop(1,"DarkRed"),t.fillStyle=n,t.fillRect(s,20,r,20);const d=[0,.2,.4,.6,.8,1];d.forEach(((e,a)=>{const i=s+a*(r/(d.length-1));t.strokeStyle="black",t.lineWidth=1,t.beginPath(),t.moveTo(i,40),t.lineTo(i,50),t.stroke(),t.fillStyle="black",t.font="12px Arial",t.textAlign="center",t.textBaseline="top",t.fillText(e.toFixed(1),i,52)}))},goHome(){this.$router.push("/")},downloadIntensityData(){const e=this.getDataFilename;if(!e)return console.error("Data filename is missing."),void(this.errorMessage="Data filename is missing.");const t=`/api/data/${e}`;y.A.get(t,{responseType:"blob"}).then((t=>{const a=new Blob([t.data],{type:"application/json"}),i=URL.createObjectURL(a),o=document.createElement("a");o.href=i,o.setAttribute("download",e),document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(i)})).catch((e=>{console.error("Error downloading intensity data:",e),this.errorMessage="Error downloading intensity data."}))}},mounted(){this.fetchData()}};const q=(0,d.A)(Y,[["render",Q],["__scopeId","data-v-4cda8b98"]]);var J=q;const Z=[{path:"/",name:"MediaUpload",component:L},{path:"/video-playback",name:"VideoPlayback",component:V},{path:"/image-playback",name:"ImagePlayback",component:J}],ee=(0,h.aE)({history:(0,h.LA)(),routes:Z});var te=ee;const ae=(0,b.y$)({state:{mediaFilename:"",dataFilename:""},mutations:{setMediaFilename(e,t){e.mediaFilename=t},setDataFilename(e,t){e.dataFilename=t}},actions:{},getters:{getMediaFilename:e=>e.mediaFilename,getDataFilename:e=>e.dataFilename}});var ie=ae;const oe=(0,i.Ef)(c);oe.use(ie),oe.use(te),oe.mount("#app")}},t={};function a(i){var o=t[i];if(void 0!==o)return o.exports;var r=t[i]={exports:{}};return e[i].call(r.exports,r,r.exports,a),r.exports}a.m=e,function(){var e=[];a.O=function(t,i,o,r){if(!i){var s=1/0;for(c=0;c<e.length;c++){i=e[c][0],o=e[c][1],r=e[c][2];for(var n=!0,d=0;d<i.length;d++)(!1&r||s>=r)&&Object.keys(a.O).every((function(e){return a.O[e](i[d])}))?i.splice(d--,1):(n=!1,r<s&&(s=r));if(n){e.splice(c--,1);var l=o();void 0!==l&&(t=l)}}return t}r=r||0;for(var c=e.length;c>0&&e[c-1][2]>r;c--)e[c]=e[c-1];e[c]=[i,o,r]}}(),function(){a.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(t,{a:t}),t}}(),function(){a.d=function(e,t){for(var i in t)a.o(t,i)&&!a.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})}}(),function(){a.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){a.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){var e={524:0};a.O.j=function(t){return 0===e[t]};var t=function(t,i){var o,r,s=i[0],n=i[1],d=i[2],l=0;if(s.some((function(t){return 0!==e[t]}))){for(o in n)a.o(n,o)&&(a.m[o]=n[o]);if(d)var c=d(a)}for(t&&t(i);l<s.length;l++)r=s[l],a.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return a.O(c)},i=self["webpackChunkwave_haptic_app"]=self["webpackChunkwave_haptic_app"]||[];i.forEach(t.bind(null,0)),i.push=t.bind(null,i.push.bind(i))}();var i=a.O(void 0,[504],(function(){return a(7686)}));i=a.O(i)})();
//# sourceMappingURL=app.dde761ef.js.map