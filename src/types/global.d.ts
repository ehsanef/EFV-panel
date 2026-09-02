import { KvSettings } from '#types/settings';

declare global {
    interface Env {
        readonly kv: KVNamespace;
        readonly UUID?: string;
        readonly TR_PASS?: string;
    }

    const SOURCE_CONTENT: string;
    const PANEL_HTML_CONTENT: string;
    const LOGIN_HTML_CONTENT: string;
    const ERROR_HTML_CONTENT: string;
    const VERSION: string;
    const ICON_CONTENT: string;
    const _VL_: string;
    const _VL_CAP_: string;
    const _VM_: string;
    const _VM_CAP_: string;
    const _TR_: string;
    const _TR_CAP_: string;
    const _SS_: string;
    const _V2_: string;
    const _project_: string;
    const _project_SM_: string;
    const _repo_: string;
    const _website_: string;
    const _public_proxy_ip_: string;

    interface Array<T> {
        concatIf<T>(condition: boolean, concat: T | T[]): T[];
    }

    interface Object {
        omitEmpty<T>(): T | undefined;
    }
}

Array.prototype.concatIf = function <T>(condition: boolean, concat: T | T[]): T[] {
    return condition ? this.concat(concat) : this;
};

Object.defineProperty(Object.prototype, 'omitEmpty', {
    value: function <T>(): T | undefined {
        const newObj: Record<string, unknown> = {};
        let hasProp = false;
        for (const key in this) {
            if (this[key] !== undefined && this[key] !== null) {
                newObj[key] = this[key];
                hasProp = true;
            }
        }
        return hasProp ? (newObj as T) : undefined;
    },
    enumerable: false,
    writable: true,
    configurable: true
});

export { };
