/**
 * smartcrop.js
 * A javascript library implementing content aware image cropping
 *
 * Copyright (C) 2016 Jonas Wagner
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
!function(){"use strict";function t(t,e){for(var i=t.data,r=e.data,a=t.width,n=t.height,o=0;o<n;o++)for(var h=0;h<a;h++){var s,d=4*(o*a+h);s=0===h||h>=a-1||0===o||o>=n-1?w(i,d):4*w(i,d)-w(i,d-4*a)-w(i,d-4)-w(i,d+4)-w(i,d+4*a),r[d+1]=s}}function e(t,e,i){for(var r=e.data,a=i.data,n=e.width,o=e.height,h=0;h<o;h++)for(var d=0;d<n;d++){var u=4*(h*n+d),g=m(r[u],r[u+1],r[u+2])/255,c=s(t,r[u],r[u+1],r[u+2]),f=c>t.skinThreshold,l=g>=t.skinBrightnessMin&&g<=t.skinBrightnessMax;a[u]=f&&l?(c-t.skinThreshold)*(255/(1-t.skinThreshold)):0}}function i(t,e,i){for(var r=e.data,a=i.data,n=e.width,o=e.height,h=0;h<o;h++)for(var s=0;s<n;s++){var d=4*(h*n+s),u=m(r[d],r[d+1],r[d+2])/255,g=v(r[d],r[d+1],r[d+2]),c=(t.saturationThreshold,u>=t.saturationBrightnessMin&&u<=t.saturationBrightnessMax);a[d+2]=c&&c?(g-t.saturationThreshold)*(255/(1-t.saturationThreshold)):0}}function r(t,e){if(t.boost){for(var i=e.data,r=0;r<e.width;r+=4)i[r+3]=0;for(r=0;r<t.boost.length;r++)a(t.boost[r],t,e)}}function a(t,e,i){for(var r=i.data,a=i.width,n=~~t.x,o=~~(t.x+t.width),h=~~t.y,s=~~(t.y+t.height),d=255*t.weight,u=h;u<s;u++)for(var g=n;g<o;g++)r[4*(u*a+g)+3]+=d}function n(t,e,i){for(var r=[],a=M(e,i),n=t.cropWidth||a,o=t.cropHeight||a,h=t.maxScale;h>=t.minScale;h-=t.scaleStep)for(var s=0;s+o*h<=i;s+=t.step)for(var d=0;d+n*h<=e;d+=t.step)r.push({x:d,y:s,width:n*h,height:o*h});return r}function o(t,e,i){for(var r={detail:0,saturation:0,skin:0,boost:0,total:0},a=e.data,n=t.scoreDownSample,o=1/n,s=e.height*n,d=e.width*n,u=e.width,g=0;g<s;g+=n)for(var c=0;c<d;c+=n){var f=4*(~~(g*o)*u+~~(c*o)),l=h(t,i,c,g),p=a[f+1]/255;r.skin+=a[f]/255*(p+t.skinBias)*l,r.detail+=p*l,r.saturation+=a[f+2]/255*(p+t.saturationBias)*l,r.boost+=a[f+3]/255*l}return r.total=(r.detail*t.detailWeight+r.skin*t.skinWeight+r.saturation*t.saturationWeight+r.boost*t.boostWeight)/(i.width*i.height),r}function h(t,e,i,r){if(e.x>i||i>=e.x+e.width||e.y>r||r>=e.y+e.height)return t.outsideImportance;i=(i-e.x)/e.width,r=(r-e.y)/e.height;var a=2*k(.5-i),n=2*k(.5-r),o=Math.max(a-1+t.edgeRadius,0),h=Math.max(n-1+t.edgeRadius,0),s=(o*o+h*h)*t.edgeWeight,d=1.41-W(a*a+n*n);return t.ruleOfThirds&&(d+=1.2*Math.max(0,d+s+.5)*(p(a)+p(n))),d+s}function s(t,e,i,r){var a=W(e*e+i*i+r*r),n=e/a-t.skinColor[0],o=i/a-t.skinColor[1],h=r/a-t.skinColor[2];return 1-W(n*n+o*o+h*h)}function d(a,h){var s={},d=new u(h.width,h.height);t(h,d),e(a,h,d),i(a,h,d),r(a,d);for(var c=g(d,a.scoreDownSample),f=-1/0,p=null,m=n(a,h.width,h.height),w=0,v=m.length;w<v;w++){var x=m[w];x.score=o(a,c,x),x.score.total>f&&(p=x,f=x.score.total)}return s.topCrop=p,a.debug&&p&&(s.crops=m,s.debugOutput=d,s.debugOptions=a,s.debugTopCrop=l({},s.topCrop)),s}function u(t,e,i){this.width=t,this.height=e,this.data=i?new Uint8ClampedArray(i):new Uint8ClampedArray(t*e*4)}function g(t,e){for(var i=t.data,r=t.width,a=Math.floor(t.width/e),n=Math.floor(t.height/e),o=new u(a,n),h=o.data,s=1/(e*e),d=0;d<n;d++)for(var g=0;g<a;g++){for(var c=4*(d*a+g),f=0,l=0,p=0,m=0,w=0,v=0,x=0,M=0;M<e;M++)for(var y=0;y<e;y++){var k=4*((d*e+M)*r+(g*e+y));f+=i[k],l+=i[k+1],p+=i[k+2],m+=i[k+3],w=Math.max(w,i[k]),v=Math.max(v,i[k+1]),x=Math.max(x,i[k+2])}h[c]=f*s*.5+.5*w,h[c+1]=l*s*.7+.3*v,h[c+2]=p*s,h[c+3]=m*s}return o}function c(t,e){var i=document.createElement("canvas");return i.width=t,i.height=e,i}function f(t){return{open:function(e){var i=e.naturalWidth||e.width,r=e.naturalHeight||e.height,a=t(i,r),n=a.getContext("2d");return!e.naturalWidth||e.naturalWidth==e.width&&e.naturalHeight==e.height?(a.width=e.width,a.height=e.height):(a.width=e.naturalWidth,a.height=e.naturalHeight),n.drawImage(e,0,0),x.Promise.resolve(a)},resample:function(e,i,r){return Promise.resolve(e).then(function(e){var a=t(~~i,~~r);return a.getContext("2d").drawImage(e,0,0,e.width,e.height,0,0,a.width,a.height),x.Promise.resolve(a)})},getData:function(t){return Promise.resolve(t).then(function(t){var e=t.getContext("2d").getImageData(0,0,t.width,t.height);return new u(t.width,t.height,e.data)})}}}function l(t){for(var e=1,i=arguments.length;e<i;e++){var r=arguments[e];if(r)for(var a in r)t[a]=r[a]}return t}function p(t){return t=16*((t-1/3+1)%2*.5-.5),Math.max(1-t*t,0)}function m(t,e,i){return.5126*i+.7152*e+.0722*t}function w(t,e){return m(t[e],t[e+1],t[e+2])}function v(t,e,i){var r=y(t/255,e/255,i/255),a=M(t/255,e/255,i/255);if(r===a)return 0;var n=r-a;return(r+a)/2>.5?n/(2-r-a):n/(r+a)}var x={};x.Promise="undefined"!=typeof Promise?Promise:function(){throw new Error("No native promises and smartcrop.Promise not set.")},x.DEFAULTS={width:0,height:0,aspect:0,cropWidth:0,cropHeight:0,detailWeight:.2,skinColor:[.78,.57,.44],skinBias:.01,skinBrightnessMin:.2,skinBrightnessMax:1,skinThreshold:.8,skinWeight:1.8,saturationBrightnessMin:.05,saturationBrightnessMax:.9,saturationThreshold:.4,saturationBias:.2,saturationWeight:.3,scoreDownSample:8,step:8,scaleStep:.1,minScale:1,maxScale:1,edgeRadius:.4,edgeWeight:-20,outsideImportance:-.5,boostWeight:100,ruleOfThirds:!0,prescale:!0,imageOperations:null,canvasFactory:c,debug:!1},x.crop=function(t,e,i){var r=l({},x.DEFAULTS,e);r.aspect&&(r.width=r.aspect,r.height=1),null===r.imageOperations&&(r.imageOperations=f(r.canvasFactory));var a=r.imageOperations,n=1,o=1;return a.open(t,r.input).then(function(t){return r.width&&r.height&&(n=M(t.width/r.width,t.height/r.height),r.cropWidth=~~(r.width*n),r.cropHeight=~~(r.height*n),r.minScale=M(r.maxScale,y(1/n,r.minScale)),!1!==r.prescale&&((o=1/n/r.minScale)<1?(t=a.resample(t,t.width*o,t.height*o),r.cropWidth=~~(r.cropWidth*o),r.cropHeight=~~(r.cropHeight*o),r.boost&&(r.boost=r.boost.map(function(t){return{x:~~(t.x*o),y:~~(t.y*o),width:~~(t.width*o),height:~~(t.height*o),weight:t.weight}}))):o=1)),t}).then(function(t){return a.getData(t).then(function(t){for(var e=d(r,t),a=e.crops||[e.topCrop],n=0,h=a.length;n<h;n++){var s=a[n];s.x=~~(s.x/o),s.y=~~(s.y/o),s.width=~~(s.width/o),s.height=~~(s.height/o)}return i&&i(e),e})})},x.isAvailable=function(t){return!!x.Promise&&!((t?t.canvasFactory:c)===c&&!document.createElement("canvas").getContext("2d"))},x.importance=h,x.ImgData=u,x._downSample=g,x._canvasImageOperations=f;var M=Math.min,y=Math.max,k=Math.abs,W=(Math.ceil,Math.sqrt);"undefined"!=typeof define&&define.amd&&define(function(){return x}),"undefined"!=typeof exports?exports.smartcrop=x:"undefined"!=typeof navigator&&(window.SmartCrop=window.smartcrop=x),"undefined"!=typeof module&&(module.exports=x)}();