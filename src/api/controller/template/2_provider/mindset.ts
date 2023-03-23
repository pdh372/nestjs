class initGlobalDependency {
    _dependencies = new Map<any, any>();

    constructor(...params: any[]) {
        params.forEach(p => this._dependencies.set(p, new p()));
    }

    get<T>(dependency: any): T {
        const instance = this._dependencies.get(dependency);
        if (!instance) throw new Error('not found class');
        return instance;
    }
}

class Dog {
    _timeMakeNoise;
    constructor() {
        this._timeMakeNoise = 0;
    }
    makeNoise() {
        console.log('go go', ++this._timeMakeNoise);
    }
}

class Cat {
    _timeMakeNoise;
    constructor() {
        this._timeMakeNoise = 0;
    }
    makeNoise() {
        console.log('mew mew', ++this._timeMakeNoise);
    }
}

const myDependencies = new initGlobalDependency(Cat, Dog);

const dog1 = myDependencies.get<Dog>(Dog);
const dog2 = myDependencies.get<Dog>(Dog);
dog1.makeNoise();
dog2.makeNoise();
