'use strict';

document.addEventListener("DOMContentLoaded", () => {
    const items = [
        { btnId: "pushbtn", imgId: "waffle_img", name: "Waffle with Berries", price: 6.5 },
        { btnId: "pushbtn2", imgId: "brulee_img", name: "Vanilla Bean Crème Brûlée", price: 7 },
        { btnId: "pushbtn3", imgId: "macaron_img", name: "Macaron Mix of Five", price: 8 },
        { btnId: "pushbtn4", imgId: "tiramisu_img", name: "Classic Tiramisu", price: 5.5 },
        { btnId: "pushbtn5", imgId: "baklava_img", name: "Pistachio Baklava", price: 4 },
        { btnId: "pushbtn6", imgId: "pie_img", name: "Lemon Meringue Pie", price: 5 },
        { btnId: "pushbtn7", imgId: "cake_img", name: "Red Velvet Cake", price: 4.5 },
        { btnId: "pushbtn8", imgId: "brownie_img", name: "Salted Caramel Brownie", price: 4.5 },
        { btnId: "pushbtn9", imgId: "pannacotta_img", name: "Vanilla Panna Cotta", price: 6.5 }
    ];

    const counters = Array(items.length).fill(0);

    const orderContainer = document.querySelector(".your_select .cart_list");
    const totalDisplay = document.querySelector(".total");
    const cartFilled = document.querySelector(".your_cart");
    const cartEmpty = document.querySelector(".your_cart0");
    const yourCart2 = document.querySelector(".your_cart2");
    const confirmButton = document.querySelector(".confirm_order");
    const confirmed = document.querySelector(".confirmed");
    const newOrderButton = document.querySelector(".new_order");

    // 最初は非表示にしておく
    confirmed.style.display = "none";
    cartEmpty.style.display = "block";
    cartFilled.style.display = "block";
    yourCart2.style.display = "block";

    // ----- ボタンイベント登録 -----
    items.forEach((item, i) => {
        const btn = document.getElementById(item.btnId);
        const overlay = document.querySelectorAll('.count-overlay')[i];
        const countEl = overlay.querySelector('.count');
        const incrementBtn = overlay.querySelector('.increment');
        const decrementBtn = overlay.querySelector('.decrement');

        // 初期表示はカウントUIを非表示
        overlay.style.display = 'none';
        countEl.textContent = counters[i];

        btn.addEventListener('click', () => {
            btn.style.display = 'none';
            overlay.style.display = 'flex';
            countEl.textContent = counters[i];
            updateCart();
        });

        // increment
        incrementBtn.addEventListener('click', () => {
            counters[i]++;
            countEl.textContent = counters[i];
            updateCart();
        });

        // decrement
        decrementBtn.addEventListener('click', () => {
            if (counters[i] > 0) counters[i]--;
            countEl.textContent = counters[i];
            if (counters[i] === 0) {
                overlay.style.display = 'none';
                btn.style.display = 'flex';
            }
            updateCart();
        });
    });

    function updateCart() {
        orderContainer.innerHTML = "";
        let total = 0;
        let cartCount = 0;

        counters.forEach((qty, i) => {
            if (qty <= 0) return;
            cartCount += qty;
            const product = items[i];

            const li = document.createElement("li");
            li.classList.add("cart_item");

            li.innerHTML = `
            <h3>${product.name}</h3>
            <ul class="item-row">
                <li class="qty">${qty}×</li>
                <li class="original-price">@$${product.price.toFixed(2)}</li>
                <li class="subtotal">$${(qty * product.price).toFixed(2)}</li>
            </ul>
        `;

            // 削除ボタン
            const removeBtn = document.createElement("button");
            removeBtn.innerHTML = "×";
            removeBtn.classList.add("remove-btn");
            removeBtn.style.cursor = "pointer";
            removeBtn.style.marginLeft = "10px";
            removeBtn.addEventListener("click", () => {
                counters[i] = 0;

                // 商品側のUIもリセット
                const overlay = document.querySelectorAll('.count-overlay')[i];
                const btn = document.getElementById(items[i].btnId);
                const countEl = overlay.querySelector('.count');

                overlay.style.display = 'none';  // カウントオーバーレイを非表示
                btn.style.display = 'flex'; // Add to Cart ボタンを表示
                countEl.textContent = 0;

                updateCart();
            });

            li.appendChild(removeBtn);
            orderContainer.appendChild(li);
            total += product.price * qty;
        });
        document.getElementById("cart-count").textContent = cartCount;

        // 合計表示
        if (totalDisplay) {
            totalDisplay.innerHTML = `Order Total: <span>$${total.toFixed(2)}</span>`;
        }

        // カート表示切替
        const hasItems = counters.some(qty => qty > 0);
        cartFilled.style.display ="block";
        yourCart2.style.display = hasItems ? "block" : "none";
        cartEmpty.style.display = hasItems ? "none" : "block";

        // 高さ調整（レスポンシブ対応）
        let itemCount = counters.filter(qty => qty > 0).length;
        let baseHeight = window.matchMedia("(max-width: 500px)").matches ? 400 : 100;
        let extraPerItem = 100;
        const extraHeight = Math.max(0, itemCount - 1) * extraPerItem;
        cartFilled.style.height = `${baseHeight + extraHeight}px`;
        cartFilled.style.transition = "height 0.3s ease";

        // カウント表示更新
        counters.forEach((qty, i) => {
            const countEl = document.querySelector(`.count${i + 1}`);
            if (countEl) countEl.textContent = qty;
        });
        items.forEach((item, i) => {
            const imgEl = document.getElementById(item.imgId);
            if (!imgEl) return;

            if (counters[i] >= 1) {
                imgEl.classList.add("selected-item");   // カウント1以上で枠追加
            } else {
                imgEl.classList.remove("selected-item"); // カウント0で枠削除
            }
        });
    }

    confirmButton.addEventListener("click", () => {
        document.body.classList.add("no-scroll");
        confirmed.style.display = "block";

        const checkList = confirmed.querySelector(".check_list");
        checkList.innerHTML = "";

        const wrapper = document.createElement("div");
        wrapper.classList.add("check_item_wrapper");
        checkList.appendChild(wrapper);

        let total = 0;

        counters.forEach((qty, i) => {
            if (qty <= 0) return; // 数量0はスキップ
            const product = items[i];
            const imgEl = document.getElementById(product.imgId);
            const imgSrc = imgEl ? imgEl.src : "";

            const checkItem = document.createElement("div");
            checkItem.classList.add("check_item");

            const contentDiv = document.createElement("div");
            contentDiv.classList.add("check_item_content");

            // 画像を作る
            if (imgSrc) {
                const imgElement = document.createElement("img");
                imgElement.src = imgSrc;
                imgElement.alt = product.name;
                imgElement.classList.add("check_img");
                contentDiv.appendChild(imgElement); // contentDiv に追加
            }

            const infoDiv = document.createElement("div");
            infoDiv.classList.add("check_info");
            infoDiv.innerHTML = `
                <h4>${product.name}</h4>
                <p>${qty} × <span>@$${product.price.toFixed(2)}</span><strong>$${(product.price * qty).toFixed(2)}</strong></p>
        `;
            contentDiv.appendChild(infoDiv);
            checkItem.appendChild(contentDiv);
            wrapper.appendChild(checkItem);

            // 商品ごとの小計を合計に足す
            total += product.price * qty;
        });

        // 合計金額を表示
        const totalDiv = document.createElement("div");
        totalDiv.classList.add("order_total");
        totalDiv.innerHTML = `<p>Order Total <strong>$${total.toFixed(2)}</strong></p>`;
        wrapper.appendChild(totalDiv);
    });



    // Start New Order を押したら非表示
    newOrderButton.addEventListener("click", function () {
        confirmed.style.display = "none";
        document.body.classList.remove("no-scroll");

        // ① カウンターをリセット
        counters.fill(0);

        // ② 各商品のUIをリセット
        items.forEach((item, i) => {
            const overlay = document.querySelectorAll('.count-overlay')[i];
            const btn = document.getElementById(item.btnId);
            const countEl = overlay.querySelector('.count');

            overlay.style.display = 'none';  // カウントオーバーレイ非表示
            btn.style.display = 'flex';       // Add to Cart 再表示
            countEl.textContent = 0;

            // 画像の赤枠もリセット
            const imgEl = document.getElementById(item.imgId);
            if (imgEl) imgEl.classList.remove("selected-item");
        });

        // ③ カートも更新
        updateCart();
    });
});