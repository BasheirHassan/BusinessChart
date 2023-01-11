/**
 * كلاس متعدد البروميس
 */

export default  class PromiseAll {


    // @ts-ignore
    constructor(main) {
        // @ts-ignore
        this.value = undefined;
        // @ts-ignore
        this.callbacks = [];
        // @ts-ignore
        const resolve = resolveValue => {
            // @ts-ignore
            this.value = resolveValue;

            this.triggerCallbacks();
        };

        main(resolve);
    }
    // @ts-ignore
    then(cb) {
        const next = new Promise(resolve => {
            // @ts-ignore
            this.callbacks.push(x => resolve(cb(x)));
        });

        return next;
    }

    triggerCallbacks() {
        // @ts-ignore
        this.callbacks.forEach(cb => {
            // @ts-ignore
            cb(this.value);
        });
    }

}




