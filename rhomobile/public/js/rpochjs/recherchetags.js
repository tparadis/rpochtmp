function post() {
  if (Rho.Network.hasNetwork()) {
    var body = '{"product" : {"name" : "test_name", "brand" : "test_brand", "sku" : "1" , "price" : "$2000" , "quantity" : "2" } }';
    postProps = {
      url: "http://148.60.11.234/api/?req=spec&format=json",
      headers: { "Content-Type": "application/json" },
      body: "req=spec&format=json"
    };
    Rho.Network.post(postProps, post_callback);
  } else {
    alert("Reseau pas disponible");
  }
}