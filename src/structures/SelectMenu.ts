import { SelectMenuType } from "../typings/SelectMenus"

export class SelectMenu {
    constructor(buttonOptions: SelectMenuType) {
        Object.assign(this, buttonOptions)
    }
}
