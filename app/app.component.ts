import { Component, OnInit, ViewChild } from '@angular/core';
import { gridData1 } from './data';
import { Grid } from '@syncfusion/ej2-grids';
import { Dialog } from '@syncfusion/ej2-popups';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { ToolbarService, EditService, PageService } from '@syncfusion/ej2-ng-grids';

@Component({
    selector: 'my-app',
    template: `<ej-grid #grid [dataSource]='data' allowPaging='true' [pageSettings]='pageSettings' [editSettings]='editSettings' [toolbar]='toolbar' (beginEdit)='beginEdit($event)'>
    <e-columns>
        <e-column field='OrderID' headerText='Order ID' width='120' textAlign="right" isPrimaryKey='true' [validationRules]='orderidrules'></e-column>
        <e-column field='CustomerID' headerText='Customer ID' width='120' textAlign="right" [validationRules]='customeridrules'></e-column>
        <e-column field='Freight' headerText='Freight' width='120' format='C2' textAlign="right" editType='numericedit' [validationRules]='freightrules'></e-column>
        <e-column field='ShipName' headerText='Ship Name' width='170'></e-column>
        <e-column field='ShipCountry' headerText='Ship Country' width='150' editType='dropdownedit' [edit]='editparams'></e-column>
    </e-columns>
</ej-grid>
<div id='confdialog'></div>`,
    providers: [ToolbarService, EditService, PageService]
})
export class AppComponent implements OnInit {

    @ViewChild('grid')
    public grid: Grid;
    public dialog: Dialog;
    public data: Object[];
    public editSettings: Object;
    public toolbar: (string| Object)[];
    public orderidrules: Object;
    public customeridrules: Object;
    public freightrules: Object;
    public pageSettings: Object;
    public editparams: Object;
    public modifiedData: { edited: Object[], deleted: Object[], added: Object[] } = { edited: [], deleted: [], added: [] };
    public tr;

    public ngOnInit(): void {
        this.data = gridData1;
        this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, showDeleteConfirmDialog: true };
        //create custom toolbar component using template 
        this.toolbar = ['add', 'edit', 'delete', 'update', 'cancel', {template: new NumericTextBox({ format: 'c2', value:1 }), type: 'Input'}];
        this.orderidrules = { required: true };
        this.customeridrules = { required: true, minLength: 5 };
        this.freightrules = { required: true, max: 1000 };
        this.pageSettings = { pageCount: 5 };
        this.editparams = { params: { popupHeight: '300px' }};
    }
    beginEdit(args) {
            this.tr = args.row;

            if (!this.dialog){
                //Custom dialog for edit confirmation
            this.dialog = new Dialog({
                content: 'Are you want to edit current row?',
                showCloseIcon: false,
                isModal: true,
                closeOnEscape: true,
                target: this.grid.element,
                width: '320px',
                animationSettings: { effect: 'None' },
                buttons: [
                    {
                        // Click the footer buttons to hide the Dialog
                        'click': () => {
                            this.grid.isEdit = false;
                            this.grid.editModule.startEdit(this.tr);
                            this.dialog.hide();
                        },
                        // Accessing button component properties by buttonModel property
                        buttonModel: {
                            //Enables the primary button
                            isPrimary: true,
                            cssClass: 'e-primary',
                            content: 'OK',                            
                        }
                    },
                    {
                        'click': () => {
                            this.dialog.hide();
                            this.grid.isEdit = false;
                            (<any>this.grid.toolbarModule).refreshToolbarItems();
                        },
                        buttonModel: {
                            content: 'Cancel',
                            cssClass: 'e-flat'
                        }
                    }
                ],
            }, '#confdialog');
            args.cancel = true;
        } else if (this.dialog && !this.dialog.visible){
            this.dialog.show();
            args.cancel = true;
        }
    }
    // Custom confirmation Dialog for edit
    actionComplete(args) {
        switch (args.requestType) {
            case 'save':
                this.modifiedData.edited.push(args.data);
                break;
            case 'delete':
                this.modifiedData.deleted.push(...args.data);
                break;
            case 'add':
                this.modifiedData.added.push(args.data);
                break;
        }
    }
}
