import { Directive, ElementRef, HostListener, Optional, Self } from '@angular/core';
import { CreditCard } from '../credit-card';
import { NgControl } from '@angular/forms';
export class CvcFormatDirective {
    constructor(el, control) {
        this.el = el;
        this.control = control;
        this.target = this.el.nativeElement;
    }
    /**
     * Updates the value to target element, or FormControl if exists.
     * @param value New input value.
     */
    updateValue(value) {
        if (this.control) {
            this.control.control.setValue(value);
        }
        else {
            this.target.value = value;
        }
    }
    onKeypress(e) {
        if (!CreditCard.restrictNumeric(e) && !CreditCard.restrictCvc(e.which, this.target)) {
            e.preventDefault();
        }
    }
    reformatCvc() {
        const val = CreditCard.replaceFullWidthChars(this.target.value)
            .replace(/\D/g, '')
            .slice(0, 4);
        const oldVal = this.target.value;
        if (val !== oldVal) {
            this.target.selectionStart = this.target.selectionEnd = CreditCard.safeVal(val, this.target, (safeVal => {
                this.updateValue(safeVal);
            }));
        }
    }
}
CvcFormatDirective.decorators = [
    { type: Directive, args: [{
                selector: '[ccCVC]',
            },] }
];
CvcFormatDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: NgControl, decorators: [{ type: Self }, { type: Optional }] }
];
CvcFormatDirective.propDecorators = {
    onKeypress: [{ type: HostListener, args: ['keypress', ['$event'],] }],
    reformatCvc: [{ type: HostListener, args: ['paste',] }, { type: HostListener, args: ['change',] }, { type: HostListener, args: ['input',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3ZjLWZvcm1hdC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNjLWxpYnJhcnkvc3JjL2xpYi9kaXJlY3RpdmVzL2N2Yy1mb3JtYXQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFLM0MsTUFBTSxPQUFPLGtCQUFrQjtJQUc3QixZQUNVLEVBQWMsRUFDTSxPQUFrQjtRQUR0QyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ00sWUFBTyxHQUFQLE9BQU8sQ0FBVztRQUU5QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDO0lBQ3RDLENBQUM7SUFFRDs7O09BR0c7SUFDSyxXQUFXLENBQUMsS0FBYTtRQUMvQixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3RDO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7U0FDM0I7SUFDSCxDQUFDO0lBR00sVUFBVSxDQUFDLENBQWdCO1FBQ2hDLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNuRixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDcEI7SUFDSCxDQUFDO0lBS00sV0FBVztRQUNoQixNQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7YUFDNUQsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7YUFDbEIsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNmLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pDLElBQUksR0FBRyxLQUFLLE1BQU0sRUFBRTtZQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ3RHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNMO0lBQ0gsQ0FBQzs7O1lBN0NGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsU0FBUzthQUNwQjs7O1lBTm1CLFVBQVU7WUFFckIsU0FBUyx1QkFVYixJQUFJLFlBQUksUUFBUTs7O3lCQWlCbEIsWUFBWSxTQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQzswQkFPbkMsWUFBWSxTQUFDLE9BQU8sY0FDcEIsWUFBWSxTQUFDLFFBQVEsY0FDckIsWUFBWSxTQUFDLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgT3B0aW9uYWwsIFNlbGYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENyZWRpdENhcmQgfSBmcm9tICcuLi9jcmVkaXQtY2FyZCc7XG5pbXBvcnQgeyBOZ0NvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjY0NWQ10nLFxufSlcbmV4cG9ydCBjbGFzcyBDdmNGb3JtYXREaXJlY3RpdmUge1xuICBwcml2YXRlIHRhcmdldDogSFRNTElucHV0RWxlbWVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmLFxuICAgIEBTZWxmKCkgQE9wdGlvbmFsKCkgcHJpdmF0ZSBjb250cm9sOiBOZ0NvbnRyb2wsXG4gICkge1xuICAgIHRoaXMudGFyZ2V0ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHZhbHVlIHRvIHRhcmdldCBlbGVtZW50LCBvciBGb3JtQ29udHJvbCBpZiBleGlzdHMuXG4gICAqIEBwYXJhbSB2YWx1ZSBOZXcgaW5wdXQgdmFsdWUuXG4gICAqL1xuICBwcml2YXRlIHVwZGF0ZVZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5jb250cm9sKSB7XG4gICAgICB0aGlzLmNvbnRyb2wuY29udHJvbC5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGFyZ2V0LnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcigna2V5cHJlc3MnLCBbJyRldmVudCddKVxuICBwdWJsaWMgb25LZXlwcmVzcyhlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKCFDcmVkaXRDYXJkLnJlc3RyaWN0TnVtZXJpYyhlKSAmJiAhQ3JlZGl0Q2FyZC5yZXN0cmljdEN2YyhlLndoaWNoLCB0aGlzLnRhcmdldCkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdwYXN0ZScpXG4gIEBIb3N0TGlzdGVuZXIoJ2NoYW5nZScpXG4gIEBIb3N0TGlzdGVuZXIoJ2lucHV0JylcbiAgcHVibGljIHJlZm9ybWF0Q3ZjKCkge1xuICAgIGNvbnN0IHZhbCA9IENyZWRpdENhcmQucmVwbGFjZUZ1bGxXaWR0aENoYXJzKHRoaXMudGFyZ2V0LnZhbHVlKVxuICAgICAgLnJlcGxhY2UoL1xcRC9nLCAnJylcbiAgICAgIC5zbGljZSgwLCA0KTtcbiAgICBjb25zdCBvbGRWYWwgPSB0aGlzLnRhcmdldC52YWx1ZTtcbiAgICBpZiAodmFsICE9PSBvbGRWYWwpIHtcbiAgICAgIHRoaXMudGFyZ2V0LnNlbGVjdGlvblN0YXJ0ID0gdGhpcy50YXJnZXQuc2VsZWN0aW9uRW5kID0gQ3JlZGl0Q2FyZC5zYWZlVmFsKHZhbCwgdGhpcy50YXJnZXQsIChzYWZlVmFsID0+IHtcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZShzYWZlVmFsKTtcbiAgICAgIH0pKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==