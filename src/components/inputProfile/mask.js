const mask = (event) => {
    let keyCode = event.keyCode;
    let pos = event.target.selectionStart;
  
    if (pos < 5) event.preventDefault();
  
    let matrix = "+375 (__) ___-__-__";
    let i = 0;
    let def = matrix.replace(/\D/g, "");
    let val = event.target.value.replace(/\D/g, "");
  
    if(val.slice(0, 3) !== '375') {
      val = '375' + val;
    }
  
    let new_value = matrix.replace(/[_\d]/g, function(a) {
      return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
    });
  
    i = new_value.indexOf("_");
    if (i !== -1) {
      i < 5 && (i = 2);
      new_value = new_value.slice(0, i);
    }
  
    let reg = matrix
      .substr(0, event.target.value.length)
      .replace(/_+/g, function(a) {
        return "\\d{1," + a.length + "}";
      })
      .replace(/[+()]/g, "\\$&");
  
    reg = new RegExp("^" + reg + "$");
    if (
      !reg.test(event.target.value) ||
      keyCode > 47 && keyCode < 58 ||
      event.type === "blur" &&
      event.target.value.length < 5
    ) {
      event.target.value = new_value;
    }
  
    if (event.type === "blur" && event.target.value.length === 0) {
      event.target.placeholder = matrix;
    }

    return event
}

export default mask;