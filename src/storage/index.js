// Storage封装
const STORAGE_KEY = 'mall';

export default {
    //存储值
    //window.sessionStorage.setItem为自带方法，this.setItem为该封装的用来存储Storage的方法
    //原理与getItem方法同理
    setItem (key, value, module_name) {
        if (module_name) {
            let val = this.getItem(module_name);
            val[key] = value;
            this.setItem(module_name, val);
        } else {
            let val = this.getStorage();
            val[key] = value;
            window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(val))
        }
    },
    //获取值
    //{user: {userName: "hzyone", age: 24, sex: 1}}
    //key为getStorage()返回的某个模块key值，即userName，module_name为模块名，即user
    //当未传入module_name时，返回的值为user: {userName: "hzyone", age: 24, sex: 1}，即val的值
    //当传入module_name后，module_name为模块名，即user,key此时代表的为userName
    getItem (key, module_name) {
        if (module_name) {
            let val = this.getItem(module_name);
            if (val) return val[key];
        }
        return this.getStorage()[key];
    },
    //获取Storage
    getStorage () {
        return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || '{}');
    },
    //清除Storage
    clear (key, module_name) {
        let val = this.getStorage();
        if (module_name) {
            if (!val[module_name]) return;
            delete val[module_name][key];
        } else {
            delete val[key];
        }
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    }
}