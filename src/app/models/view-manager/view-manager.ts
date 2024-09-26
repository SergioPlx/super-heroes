import { IModelViewManager } from "../../interfaces/view-manager/view-manager";

export class ModelViewManager {

    private _isLoaded: boolean;

    constructor({ loaded }: IModelViewManager) {
        this._isLoaded = loaded;
    }

    public setLoaded(pIsLoaded: boolean): void {
        this._isLoaded = pIsLoaded;
    }

    get isLoaded(): boolean {
        return this._isLoaded;
    }
}
