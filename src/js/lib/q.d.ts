
interface Q {
    (value): any;
    resolve(value): any;
    nextTick(task): any;
    any(promises: any[]): any;
    all(promises: any[]): any;
    defer(): any;
}

declare var Q: Q;