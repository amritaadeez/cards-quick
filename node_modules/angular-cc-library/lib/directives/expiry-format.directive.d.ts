import { ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import * as ɵngcc0 from '@angular/core';
export declare class ExpiryFormatDirective {
    private el;
    private control;
    private target;
    constructor(el: ElementRef, control: NgControl);
    /**
     * Updates the value to target element, or FormControl if exists.
     * @param value New input value.
     */
    private updateValue;
    onKeypress(e: KeyboardEvent): boolean;
    onKeydown(e: KeyboardEvent): void;
    onChange(): void;
    onInput(): void;
    private formatExpiry;
    private formatForwardSlashAndSpace;
    private formatForwardExpiry;
    private formatBackExpiry;
    private reformatExpiry;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<ExpiryFormatDirective, [null, { optional: true; self: true; }]>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDeclaration<ExpiryFormatDirective, "[ccExp]", never, {}, {}, never>;
}

//# sourceMappingURL=expiry-format.directive.d.ts.map