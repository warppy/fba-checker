function dp() {
    // 販売元がAmazon.co.jpか
    const elm = document.getElementsByClassName('tabular-buybox-text');
    let sellerName = '';
    for (let i = 0; i < elm.length; i++) {
        if (elm[i].getAttribute('tabular-attribute-name') === '販売元') {
            sellerName = elm[i].innerText.trim();
            break;
        }
    }
    
    // FBA販売者が居るか
    const mbc = document.getElementById('mbc');
    let isFBAseller = false;
    if (mbc) {
        isFBAseller = mbc.getElementsByClassName('a-icon-prime') ? true : false;
    }

    // 販売者数
    let sellersNum = 1;
    if (mbc) {
        sellersNum = document.getElementsByClassName('pa_mbc_on_amazon_offer').length;
    }

    // 表示
    const text = '販売元: ' + sellerName + ' / '
        + 'Seller数: ' + sellersNum + ' / '
        + 'FBA Seller: ' + (isFBAseller ? '存在' : 'なし');

    // 表示
    // const text = headerText(sellerName, sellersNum, isFBAseller);

    // 期待値高
    const isPromising = (sellerName !== 'Amazon.co.jp' && sellersNum > 1 && isFBAseller);

    // const unmatchFactorSpan = document.createElement('span');
    // infoElement.setAttribute('style', 'color:red;');
    const infoElement = document.createElement('div');
    infoElement.setAttribute('style', 'background-color:yellow; padding: 5px;');

    if (isPromising) {
        infoElement.textContent = 'OK / ' + text;
    } else {
        infoElement.textContent = 'NG / ' + text;
    }

    const element = document.getElementsByTagName('body')[0];
    if (!isPromising) {
        element.setAttribute('style', 'background-color:black; opacity:0.5; z-index: 1');
    }
    element.insertAdjacentElement('afterbegin', infoElement);

    console.log(text);
    // window.alert(text);
}



function dpList(){
    const list = document.getElementsByClassName('s-main-slot')[0].children;
    let dataUUID;  

    const widget = document.body.querySelector('[cel_widget_id="UPPER-RESULT_INFO_BAR-0"]');
    const observer = new MutationObserver(function(mutationsList, observer){
        setTimeout(() => {dpList()}, 500);
        // location.reload();
        console.log(mutationsList);
        console.log(observer);
    });
    observer.observe(widget, {
        childList: true,
        subtree: true,
        attributes: true
    });

    for(let i = 0; i < list.length; i++){
        // ページ変更を検出用にイベントを準備
        dataUUID = list[i].getAttribute('data-uuid');
        console.log( 'dataUUID: ' + dataUUID);

        const dataComponentType = list[i].getAttribute('data-component-type');
        if(!dataComponentType || dataComponentType !== 's-search-result'){
            // 結果セット以外の場合は無視
            console.log('結果セット以外');
            continue;
        }
        
        

        // 対象外の文字列を検索
        const text = list[i].innerText;
        const regexp = /MP3|アプリ|スポンサー|Kindle|ペーパーバッグ|単行本|Prime|ペーパーバック|ハードカバー|Kindle版 (電子書籍)|ウェア&シューズ/
        if(regexp.test(text)){
            // 表示しない
            list[i].setAttribute('style', 'display:none;');
            console.log('表示しない');
        }
    }
}

function headerText (sellerName, sellersNum, isFBAseller){
    if(sellerName === 'Amazon.co.jp'){
        sellerName = invalidHeaderValue(sellerName);
    }

    if(sellersNum === 1){
        sellersNum = invalidHeaderValue(sellersNum);
    }

    if(!isFBAseller){
        fbaSeller = invalidHeaderValue('なし');
    }else{
        fbaSeller = invalidHeaderValue('あり');
    }

    return '販売元: ' + sellerName + ' / '
         + 'Seller数: ' + sellersNum + ' / '
         + 'FBA Seller: ' + fbaSeller;
}

function invalidHeaderValue(text){
    //  red / bold
    const element = document.createElement('span');
    element.setAttribute('style', 'color:red; font-weight:bold');
    const textNode = document.createTextNode(text);
    element.appendChild(textNode);
    return element;
}

// ページ変更時


window.onload = function(){
    // 商品ページ
    const isDP = document.getElementById('dp') ? true : false;
    if(isDP){
        dp();
    }else{
        dpList();
    }
};
