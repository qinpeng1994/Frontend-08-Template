/**
 * 滑块调色盘双向绑定 mvvm
 * */ 
let usedRectivties = [];
    let callbacks = new Map(); // []  ---Map
    let reactives = new Map(); // 调用时，加一个缓存
    let object = {
      r: 1,
      g: 1,
      b: 1
    };

    let po = reactive(object);

    effect(() => {
      document.querySelector("#r").value = po.r;
    })
    effect(() => {
      document.querySelector("#g").value = po.g;
    })
    effect(() => {
      document.querySelector("#b").value = po.b;
    })
    effect(() => {
      document.querySelector("#color").style.backgroundColor = `rgb(${po.r},${po.g},${po.b})`;
      // console.log(`rgb(${po.r},${po.g},${po.b})`);
    })
    document.querySelector("#r").addEventListener("input", event => po.r = event.target.value);
    document.querySelector("#g").addEventListener("input", event => po.g = event.target.value);
    document.querySelector("#b").addEventListener("input", event => po.b = event.target.value);

    /* effect */
    function effect(callback) {
      usedRectivties = [];
      callback();
    //   console.log(usedRectivties);
      for (let reactivity of usedRectivties) {
        if (!callbacks.has(reactivity[0])) { // 多次注册
            callbacks.set(reactivity[0], new Map());
        }
        if (!callbacks.get(reactivity[0]).has(reactivity[1])) {
          callbacks.get(reactivity[0]).set(reactivity[1], []); // map
        }
        callbacks.get(reactivity[0]).get(reactivity[1]).push(callback);
      }
    }
    /* data --- dom  */
    function reactive(obj) {
      if (reactives.has(obj)) {
        return reactives.get(obj);
      }
      let proxy = new Proxy(obj, {
        set(obj, prop, val) {
          obj[prop] = val;

          if (callbacks.get(obj))
            if (callbacks.get(obj).get(prop))
              for (let callback of callbacks.get(obj).get(prop)) {
                callback();
              }
          return obj[prop];
        },
        get(obj, prop) {
          usedRectivties.push([obj, prop]);
          if (typeof obj[prop] === 'object')  // 多层对象情形下
            return reactive(obj[prop]);
          return obj[prop];
        }
      });
      reactives.set(obj, proxy);
      return proxy;
    }
  
  