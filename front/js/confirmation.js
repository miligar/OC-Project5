const params = new URLSearchParams(window.location.search);
document.getElementById("orderId").textContent = params.get('id');
localStorage.removeItem('cartArray');