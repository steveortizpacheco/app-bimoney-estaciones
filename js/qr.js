class Bimoney {
    url = "http://bimoney.co/";
    instance = "bimoney-test";
    service = 'webresources/service';
    endpoints = {
        "gas":{
            "type":"POST",
            "slug":"qr-eds-gas"
        },
        "gasolina":{
            "type":"POST",
            "slug": "qr-eds-gasolina"
        },
        "com":{
            "type":"GET",
            "slug":"",
            "url":"webresources/qr/com"
        }
    }
    setREST(slug="com", params=""){
        let module = this.endpoints[slug];
        let service_app = this.url + this.instance;
        let service_path = `${this.service}/${module.slug}`;
        if(module.hasOwnProperty("url")){
            service_path = module.url;
            let isGET = module.type == "GET";
            if(isGET && params.length > 0){
                service_path += `/${params}`;
            }
        }
        let url = `${service_app}/${service_path}`;
        console.log(url);
        return {
            "url": url,
            "type":module.type
        }
    }
}

var bimoney = new Bimoney();

function render(responseText) {
    let query_qr = ".imagen-qr img";
    let dom_qr = document.body.querySelector(query_qr);
    if(responseText == null){
        return false;
    }
    let isQRImage = responseText.indexOf("data:image") > -1;
    isQRImage &= dom_qr != null;
    if(isQRImage){
        console.log(responseText);
        dom_qr.src = responseText;
    }
}

function asyncXHR({ url="", type= "GET"}) {
    var req = new XMLHttpRequest();
    if(url.length <= 0){
        console.log(url);
        return false;
    }
    req.open(type, url, true);
    req.setRequestHeader('Access-Control-Allow-Origin', '*');
    req.onreadystatechange = function (aEvt) {
        let isReadyState = req.readyState == 4;
        if (isReadyState) {
            let isReadyStatus = req.status == 200;
            if(isReadyStatus)
                render(req.response);
            else {
                console.warn("Error loading page!\n", req.status, req.statusText);
            }
        }
    };
    req.send(null);
}
/*function syncXHR({ url="", type= "GET"}) {
    var req = new XMLHttpRequest();
    if(url.length <= 0){
        console.log(url);
        return false;
    }
    req.open(type, url, false);
    req.setRequestHeader("Origin", "http://localhost");
    req.setRequestHeader("Access-Control-Request-Headers", "Content-Type, Authorization");
    req.setRequestHeader("Access-Control-Request-Method","POST");
    req.send(null);
    let isReady = req.status == 200;
    if (isReady) {
       return req.responseText;
    }
    return "";
}*/
const setQRForm = (form) => {
    form.addEventListener('change', change_event => {
        // sync
        // render(syncXHR())
        // async
        asyncXHR()
    });
    return form;

};

function initQR() {
    let commerce_value = document.body.querySelector(".texto-refrescar");
    if (commerce_value != null) {
        console.log("rendering init QR");
        render(asyncXHR(bimoney.setREST("com", commerce_value.innerHTML)));
    }
}

function setQREvent() {
    let form = document.body.getElementsByTagName('form');
    let is_form = form != null && form.length > 0;
    initQR();
    if (is_form) {
        form = setQRForm(form);
    }
}
/* run */
setQREvent();
document.addEventListener('DOMContentLoaded',function (doc_event) {
    setQREvent();
})