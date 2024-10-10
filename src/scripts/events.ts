import { AnnotationAlignment, Connector, ConnectorModel, ContextMenuItemModel, Diagram, DiagramBeforeMenuOpenEventArgs, HorizontalAlignment, IDragEnterEventArgs, IRotationEventArgs, ISelectionChangeEventArgs, ISizeChangeEventArgs, NodeConstraints, NodeModel, PathAnnotationModel, SelectorModel, ShapeAnnotationModel, TextAlign, TextStyleModel, VerticalAlignment } from "@syncfusion/ej2-angular-diagrams";
import { PathAnnotation, ShapeAnnotation } from '@syncfusion/ej2-diagrams'
import { NodeProperties, SelectorViewModel } from "./selector";
import { ChangeArgs as ButtonChangeArgs, ChangeEventArgs as CheckBoxChangeEventArgs, } from '@syncfusion/ej2-buttons'
import { ChangeEventArgs as NumericChangeEventArgs } from '@syncfusion/ej2-inputs';
import { ColorPickerEventArgs } from "@syncfusion/ej2-angular-inputs";
import { DropDownListComponent } from "@syncfusion/ej2-angular-dropdowns";
import { ChangeEventArgs as DropDownChangeEventArgs } from "@syncfusion/ej2-dropdowns"
import { ClickEventArgs as ToolbarClickEventArgs } from "@syncfusion/ej2-navigations"


export class DiagramClientSideEvents {

    private selectedItem: SelectorViewModel;
    public ddlTextPosition: DropDownListComponent;
    constructor(selectedItem: SelectorViewModel) {
        this.selectedItem = selectedItem;

    }
    public drawingNode: any;
    public selectionChange(args: ISelectionChangeEventArgs): void {
        if (args.state === 'Changed') {
            let diagram = this.selectedItem.diagram;
            let toolbarObj = this.selectedItem.toolbarObj;
            // let diagram = (document.getElementById('diagram') as any).ej2_instances[0];
            // let toolbarObj = (document.getElementById('toolbarEditor') as any).ej2_instances[0];
            var multiSelect;
            var selectedItems = diagram.selectedItems.nodes;
            selectedItems = selectedItems.concat(diagram.selectedItems.connectors as Object[]);
            this.selectedItem.utilityMethods.enableToolbarItems(selectedItems);
            var nodeContainer = document.getElementById('nodePropertyContainer');
            nodeContainer.classList.remove('multiple');
            nodeContainer.classList.remove('connector');
            if (selectedItems.length > 1) {
                multiSelect = true;
                this.multipleSelectionSettings(selectedItems as Object[]);
                toolbarObj.items[7].tooltipText = 'Group';
                toolbarObj.items[7].prefixIcon = 'sf-icon-group';
                for (var i = 7; i <= 25; i++) {
                    toolbarObj.items[i].visible = true;
                }
            }
            else if (selectedItems.length === 1) {
                multiSelect = false;

                this.singleSelectionSettings(selectedItems[0] as Object[]);
                for (var i = 7; i <= 25; i++) {
                    if (i <= 16) {
                        toolbarObj.items[i].visible = false;
                    }
                    else {
                        toolbarObj.items[i].visible = true;

                    }
                }
                if (selectedItems[0].children && selectedItems[0].children.length > 0) {
                    toolbarObj.items[7].tooltipText = 'UnGroup';
                    toolbarObj.items[7].prefixIcon = 'sf-icon-ungroup';
                    toolbarObj.items[7].visible = true;
                }
            }
            else {
                this.objectTypeChange('diagram');
                for (var i = 7; i <= 25; i++) {
                    toolbarObj.items[i].visible = false;
                }
            }
        }
    };
    public multipleSelectionSettings(selectedItems: Object[]): void {
        this.objectTypeChange('None');
        let showConnectorPanel: boolean = false, showNodePanel: boolean = false;
        let showTextPanel: boolean = false, showConTextPanel: boolean = false;
        let nodeContainer: HTMLElement = document.getElementById('nodePropertyContainer');
        for (let i: number = 0; i < selectedItems.length; i++) {
            let object: Object = selectedItems[i];
            if ((object as ConnectorModel).type === undefined && (!showNodePanel || !showTextPanel)) {
                showNodePanel = true;
                showTextPanel = (object as NodeModel).annotations.length > 0 && (object as NodeModel).annotations[0].content ? true : false;
            } else if ((object as ConnectorModel).type !== undefined && (!showConnectorPanel || !showConTextPanel)) {
                showConnectorPanel = true;
                showConTextPanel = (object as ConnectorModel).annotations.length > 0 && (object as ConnectorModel).annotations[0].content ? true : false;
            }
        }
        let selectItem1: SelectorModel = this.selectedItem.diagram.selectedItems;
        if (showNodePanel) {
            nodeContainer.style.display = '';
            nodeContainer.classList.add('multiple');
            if (showConnectorPanel) {
                nodeContainer.classList.add('connector');
            }
            this.selectedItem.utilityMethods.bindNodeProperties(selectItem1.nodes[0], this.selectedItem);
        }
        if (showConnectorPanel && !showNodePanel) {
            document.getElementById('connectorPropertyContainer').style.display = '';
            this.selectedItem.utilityMethods.bindConnectorProperties(selectItem1.connectors[0], this.selectedItem);
        }
        if (showTextPanel || showConTextPanel) {
            document.getElementById('textPropertyContainer').style.display = '';
            if (showTextPanel && showConTextPanel) {
                document.getElementById('textPositionDiv').style.display = 'none';
                document.getElementById('textColorDiv').className = 'col-xs-6 db-col-left';
            } else {
                document.getElementById('textPositionDiv').style.display = '';
                document.getElementById('textColorDiv').className = 'col-xs-6 db-col-right';
                if (showConTextPanel) {
                    this.ddlTextPosition.dataSource = this.selectedItem.textProperties.getConnectorTextPositions();
                    //this.selectedItem.utilityMethods.bindTextProperties(selectItem1.connectors[0].annotations[0].style, this.selectedItem);
                } else {
                    this.ddlTextPosition.dataSource = this.selectedItem.textProperties.getNodeTextPositions();
                    //this.selectedItem.utilityMethods.bindTextProperties(selectItem1.connectors[0].annotations[0].style, this.selectedItem);
                }
                this.ddlTextPosition.dataBind();
            }
        }
    };
    public singleSelectionSettings(selectedObject: Object): void {
        let object: NodeModel | ConnectorModel = null;
        if ((selectedObject as Connector).type === undefined) {
            this.objectTypeChange('node');
            object = selectedObject as NodeModel;
            this.selectedItem.utilityMethods.bindNodeProperties(object, this.selectedItem);
        } else {
            this.objectTypeChange('connector');
            object = selectedObject as ConnectorModel;
            this.selectedItem.utilityMethods.bindConnectorProperties(object, this.selectedItem);
        }
        if (object.shape && object.shape.type === 'Text') {
            document.getElementById('textPropertyContainer').style.display = '';
            document.getElementById('toolbarTextAlignmentDiv').style.display = 'none';
            document.getElementById('textPositionDiv').style.display = 'none';
            document.getElementById('textColorDiv').className = 'col-xs-6 db-col-left';
            this.selectedItem.utilityMethods.bindTextProperties(object.style, this.selectedItem);
        } else if (object.annotations.length > 0 && object.annotations[0].content) {
            document.getElementById('textPropertyContainer').style.display = '';
            let annotation: ShapeAnnotation | PathAnnotation = null;
            document.getElementById('toolbarTextAlignmentDiv').style.display = '';
            document.getElementById('textPositionDiv').style.display = '';
            document.getElementById('textColorDiv').className = 'col-xs-6 db-col-right';
            this.selectedItem.utilityMethods.bindTextProperties(object.annotations[0].style, this.selectedItem);
            this.selectedItem.utilityMethods.updateHorVertAlign(object.annotations[0].horizontalAlignment, object.annotations[0].verticalAlignment);
            if (object.annotations[0] instanceof ShapeAnnotation) {
                annotation = object.annotations[0] as ShapeAnnotation;
                this.ddlTextPosition.dataSource = this.selectedItem.textProperties.getNodeTextPositions();
                this.ddlTextPosition.value = this.selectedItem.textProperties.textPosition = null;
                this.ddlTextPosition.dataBind();
                this.ddlTextPosition.value = this.selectedItem.textProperties.textPosition = this.selectedItem.utilityMethods.getPosition(annotation.offset);
                this.ddlTextPosition.dataBind();
            } else if (object.annotations[0] instanceof PathAnnotation) {
                annotation = object.annotations[0] as PathAnnotation;
                this.ddlTextPosition.dataSource = this.selectedItem.textProperties.getConnectorTextPositions();
                this.ddlTextPosition.value = this.selectedItem.textProperties.textPosition = null;
                this.ddlTextPosition.dataBind();
                this.ddlTextPosition.value = this.selectedItem.textProperties.textPosition = annotation.alignment;
                this.ddlTextPosition.dataBind();
            }
        }

    };
    public sizeChange(args: ISizeChangeEventArgs) {
        this.selectedItem.preventPropertyChange = true;
        this.selectedItem.nodeProperties.width = (Math.round(args.newValue.width * 100) / 100);
        this.selectedItem.nodeProperties.height = (Math.round(args.newValue.height * 100) / 100);
        if (args.state === 'Completed') {
            this.selectedItem.isModified = true;
            this.selectedItem.preventPropertyChange = false;
        }
    };
    public rotateChange(args: IRotationEventArgs) {
        let diagram = this.selectedItem.diagram;
        if (diagram.selectedItems.nodes.concat(diagram.selectedItems.connectors as object).length === 1) {
            this.selectedItem.nodeProperties.rotateAngle = args.newValue ? args.newValue.rotateAngle : diagram.selectedItems.nodes.concat(diagram.selectedItems.connectors as object)[0].rotateAngle;
        }
    };
    public positionChange(args: any) {
        this.selectedItem.preventPropertyChange = true;
        this.selectedItem.nodeProperties.offsetX = (Math.round(args.newValue.offsetX * 100) / 100);
        this.selectedItem.nodeProperties.offsetY = (Math.round(args.newValue.offsetY * 100) / 100);
        if (args.state === 'Completed') {
            this.selectedItem.isModified = true;
            this.selectedItem.preventPropertyChange = false;
        }
    };
    public collectionChange(args: ISelectionChangeEventArgs): void {
        if (args.state === 'Changed') {
            this.selectedItem.isModified = true;
        }
    }
    public dragEnter(args: IDragEnterEventArgs): void {
        let obj: NodeModel = args.element as NodeModel;
        obj.constraints = NodeConstraints.Default;
        if (obj.id.indexOf('Door_close') !== -1) {
            obj.width = 40;
            obj.height = 42;
        }
        else if (obj.id.indexOf('Double_door_close') !== -1) {
            obj.width = 80;
            obj.height = 42;
        }
        else if (obj.id.indexOf('Circle_Dining_Table') !== -1) {
            obj.width = 50;
            obj.height = 50;
        }
        else if (obj.id.indexOf('Circle_Study_Table') !== -1 || obj.id.indexOf('Circle_Study_Table1') !== -1 || obj.id.indexOf('Circle_Study_Table2') !== -1 || obj.id.indexOf('Circle_Study_Table3') !== -1) {
            obj.width = 40;
            obj.height = 40;
        }
        else if (obj.id.indexOf('Rectangle_Dining_Table') !== -1) {
            obj.width = 50;
            obj.height = 50;
        }
        else if (obj.id.indexOf('Oblong_Dining_Table') !== -1 || obj.id.indexOf('Oval_Dining_Table') !== -1) {
            obj.width = 90;
            obj.height = 50;
        }
        else if (obj.id.indexOf('Rectangular_Table_for_Two') !== -1 || obj.id.indexOf('Circular_Table_for_Two') !== -1) {
            obj.width = 50;
            obj.height = 60;
        }
        else if (obj.id.indexOf('Rectangle_Study_Table') !== -1 || obj.id.indexOf('Rectangle_Study_Table1') !== -1) {
            obj.width = 80;
            obj.height = 40;
        }
        else if (obj.id.indexOf('Refrigerator') !== -1) {
            obj.width = 52;
            obj.height = 60;
        }
        else if (obj.id.indexOf('Stool') !== -1) {
            obj.width = 23;
            obj.height = 23;
        }
        else if (obj.id.indexOf('Wall_Corner') !== -1 || obj.id.indexOf('Wall_Corner1') !== -1) {
            obj.width = 50;
            obj.height = 50;
        }
        else if (obj.id.indexOf('Water_Cooler') !== -1 || obj.id.indexOf('Elevator') !== -1) {
            obj.width = 40;
            obj.height = 40;
        }
        else if (obj.id.indexOf('Chair1') !== -1) {
            obj.width = 25;
            obj.height = 25;
        }
        else if (obj.id.indexOf('Chair') !== -1 || obj.id.indexOf('Large_Plant') !== -1) {
            obj.width = 28;
            obj.height = 32;
        }
        else if (obj.id.indexOf('Double_bed') !== -1 || obj.id.indexOf('Double_bed1') !== -1) {
            obj.width = 100;
            obj.height = 90;
        }
        else if (obj.id.indexOf('Single_bed') !== -1 || obj.id.indexOf('Single_bed1') !== -1) {
            obj.width = 50;
            obj.height = 90;
        }
        else if (obj.id.indexOf('Book_Case') !== -1) {
            obj.width = 60;
            obj.height = 20;
        }
        else if (obj.id.indexOf('Warddrobe') !== -1 || obj.id.indexOf('Warddrobe1') !== -1) {
            obj.width = 73;
            obj.height = 35;
        }
        else if (obj.id.indexOf('Small_Plant') !== -1 || obj.id.indexOf('Lamp_light') !== -1) {
            obj.width = 25;
            obj.height = 25;
        }
        else if (obj.id.indexOf('Matte') !== -1 || obj.id.indexOf('Matte1') !== -1) {
            obj.width = 40;
            obj.height = 20;
        }
        else if (obj.id.indexOf('Flat_TV') !== -1 || obj.id.indexOf('Flat_TV1') !== -1) {
            obj.width = 68;
            obj.height = 10;
        }
        else if (obj.id.indexOf('TV') !== -1) {
            obj.width = 40;
            obj.height = 25;
        }
        else if (obj.id.indexOf('Single_Sofa') !== -1 || obj.id.indexOf('Couch') !== -1) {
            obj.width = 45;
            obj.height = 40;
        }
        else if (obj.id.indexOf('Sofa') !== -1 || obj.id.indexOf('Double_Sofa') !== -1 || obj.id.indexOf('Lounge') !== -1) {
            obj.width = 100;
            obj.height = 35;
        }
        else if (obj.id.indexOf('Window_Garden') !== -1) {
            obj.width = 80;
            obj.height = 18;
        }
        else if (obj.id.indexOf('Small_Gas_Range') !== -1) {
            obj.width = 70;
            obj.height = 32;
        }
        else if (obj.id.indexOf('Large_Gas_Range') !== -1 || obj.id.indexOf('Large_Gas_Range1') !== -1) {
            obj.width = 100;
            obj.height = 32;
        }
        else if (obj.id.indexOf('Window') !== -1 || obj.id.indexOf('window1') !== -1) {
            obj.width = 50;
            obj.height = 6;
        }

        else if (obj.id.indexOf('Piano') !== -1) {
            obj.width = 68;
            obj.height = 71;
        }
        else if (obj.id.indexOf('Staircase') !== -1 || obj.id.indexOf('Staircase1') !== -1 || obj.id.indexOf('Staircase2') !== -1) {
            obj.width = 150;
            obj.height = 50;
        }
        else if (obj.id.indexOf('Printer') !== -1 || obj.id.indexOf('Laptop') !== -1) {
            obj.width = 30;
            obj.height = 30;
        }
        else if (obj.id.indexOf('Room') !== -1 || obj.id.indexOf('T_Room') !== -1 || obj.id.indexOf('L_Room') !== -1 || obj.id.indexOf('T_Wall') !== -1) {
            obj.width = 100;
            obj.height = 100;
        }
        else if (obj.id.indexOf('Double_Sink') !== -1 || obj.id.indexOf('Double_Sink1') !== -1 || obj.id.indexOf('Double_Sink2') !== -1 || obj.id.indexOf('Double_Sink4') !== -1) {
            obj.width = 76;
            obj.height = 38;
        }
        else if (obj.id.indexOf('Toilet1') !== -1 || obj.id.indexOf('Toilet2') !== -1) {
            obj.width = 23;
            obj.height = 36;
        }
        else if (obj.id.indexOf('Corner_Shower') !== -1 || obj.id.indexOf('Shower') !== -1) {
            obj.width = 50;
            obj.height = 50;
        }
        else if (obj.id.indexOf('Wash_Basin1') !== -1 || obj.id.indexOf('Wash_Basin2') !== -1 || obj.id.indexOf('Wash_Basin3') !== -1 || obj.id.indexOf('Wash_Basin5') !== -1 || obj.id.indexOf('Wash_Basin6') !== -1) {
            obj.width = 35;
            obj.height = 30;
        }
        else if (obj.id.indexOf('Bath_Tub') !== -1 || obj.id.indexOf('Bath_Tub1') !== -1 || obj.id.indexOf('Bath_Tub2') !== -1 || obj.id.indexOf('Bath_Tub3') !== -1) {
            obj.width = 55;
            obj.height = 30;
        }
        else {
            obj.width = 50;
            obj.height = 50;
        }

    }
    public objectTypeChange(objectType: string): void {
        document.getElementById('diagramPropertyContainer').style.display = 'none';
        document.getElementById('nodePropertyContainer').style.display = 'none';
        document.getElementById('textPropertyContainer').style.display = 'none';
        document.getElementById('connectorPropertyContainer').style.display = 'none';
        switch (objectType) {
            case 'diagram':
                document.getElementById('diagramPropertyContainer').style.display = '';
                break;
            case 'node':
                document.getElementById('nodePropertyContainer').style.display = '';
                break;
            case 'connector':
                document.getElementById('connectorPropertyContainer').style.display = '';
                break;
        }
    };
    public historyChange() {
        // let diagram = (document.getElementById('diagram') as any).ej2_instances[0];
        let diagram = this.selectedItem.diagram;
        let toolbarContainer: HTMLDivElement = document.getElementsByClassName('db-toolbar-container')[0] as HTMLDivElement;
        toolbarContainer.classList.remove('db-undo');
        toolbarContainer.classList.remove('db-redo');
        if (diagram.historyManager.undoStack.length > 0) {
            toolbarContainer.classList.add('db-undo');
        }
        if (diagram.historyManager.redoStack.length > 0) {
            toolbarContainer.classList.add('db-redo');
        }
        this.selectedItem.utilityMethods.viewSelectionChange(diagram, this.selectedItem.showPageBreak);
    };
    public diagramClear() {
        this.selectedItem.diagram.clear();
    }

}

export class DiagramPropertyBinding {
    private selectedItem: SelectorViewModel;
    private nodeProperties: NodeProperties;
    constructor(selectedItem: SelectorViewModel, nodeProperties: NodeProperties) {
        this.selectedItem = selectedItem;
        this.nodeProperties = nodeProperties;
    }
    public pageOrientationChange(args: any): void {
        if (args.target) {
            var target = args.target;
            let designContextMenu = (document.getElementById('designContextMenu') as any).ej2_instances[0];
            let diagram = this.selectedItem.diagram;
            var items = designContextMenu.items;
            var option = target.id ? target.id : (args.currentTarget.ej2_instances[0].iconCss === 'sf-icon-portrait' ? 'pagePortrait' : 'pageLandscape');
            switch (option) {
                case 'pagePortrait':
                    // diagram.pageSettings.isPortrait = true;
                    // diagram.pageSettings.isLandscape = false;
                    diagram.pageSettings.orientation = 'Portrait';
                    items[0].items[0].iconCss = '';
                    items[0].items[1].iconCss = 'sf-icon-check-tick';
                    document.getElementById('pageLandscape').classList.remove('e-active');
                    break;
                case 'pageLandscape':
                    // diagram.pageSettings.isPortrait = false;
                    // diagram.pageSettings.isLandscape = true;
                    diagram.pageSettings.orientation = 'Landscape';
                    items[0].items[0].iconCss = 'sf-icon-check-tick';
                    items[0].items[1].iconCss = '';
                    document.getElementById('pagePortrait').classList.remove('e-active');
                    break;
            }
            diagram.dataBind();
        }
    };
    public pageDimensionChange(args: NumericChangeEventArgs | any): void {
        if (args.event) {
            let pageWidth: number = Number(this.selectedItem.pageSettings.pageWidth);
            let pageHeight: number = Number(this.selectedItem.pageSettings.pageHeight);
            let target: HTMLInputElement = args.event.target as HTMLInputElement;
            if (target.tagName.toLowerCase() === 'span') {
                target = target.parentElement.children[0] as HTMLInputElement;
            }
            let diagram: Diagram = this.selectedItem.diagram;
            if (target.id === 'numerictextbox_0') {
                pageWidth = parseInt(target.value.split(',').join(''), 10);
            } else {
                pageHeight = parseInt(target.value.replace(/,/g, ''), 10);
            }
            if (pageWidth && pageHeight) {
                if (pageWidth > pageHeight) {
                    this.selectedItem.pageSettings.isPortrait = false;
                    this.selectedItem.pageSettings.isLandscape = true;
                    diagram.pageSettings.orientation = 'Landscape';
                } else {
                    this.selectedItem.pageSettings.isPortrait = true;
                    this.selectedItem.pageSettings.isLandscape = false;
                    diagram.pageSettings.orientation = 'Portrait';
                }
                this.selectedItem.pageSettings.pageWidth = diagram.pageSettings.width = pageWidth;
                this.selectedItem.pageSettings.pageHeight = diagram.pageSettings.height = pageHeight;
                diagram.dataBind();
            }
        }
    };
    public pageBackgroundChange1(args: ColorPickerEventArgs | any): void {
        if (args.currentValue) {
            // let target: HTMLInputElement = args.target as HTMLInputElement; 
            let diagram: Diagram = this.selectedItem.diagram;
            diagram.pageSettings.background = {
                color: args.currentValue.rgba
            };
            diagram.dataBind();
        }
    };
    public pageBreaksChange(args: CheckBoxChangeEventArgs): void {
        if (args.event) {
            this.selectedItem.pageSettings.pageBreaks = args.checked;
            this.selectedItem.diagram.pageSettings.showPageBreaks = args.checked;
        }
    };
    public paperListChange(args: any) {
        document.getElementById('pageDimension').style.display = 'none';
        document.getElementById('pageOrientation').style.display = '';
        // let diagram = (document.getElementById('diagram') as any).ej2_instances[0];
        let diagram = this.selectedItem.diagram;
        var value = args.value || args.item.value;
        var paperSize = this.selectedItem.utilityMethods.getPaperSize(value);
        var pageWidth = paperSize.pageWidth;
        var pageHeight = paperSize.pageHeight;
        if (pageWidth && pageHeight) {
            if (diagram.pageSettings.orientation === 'Portrait') {
                if (pageWidth > pageHeight) {
                    var temp = pageWidth;
                    pageWidth = pageHeight;
                    pageHeight = temp;
                }
            }
            else {
                if (pageHeight > pageWidth) {
                    var temp = pageHeight;
                    pageHeight = pageWidth;
                    pageWidth = temp;
                }
            }
            diagram.pageSettings.width = pageWidth;
            diagram.pageSettings.height = pageHeight;
        }
        else {
            document.getElementById('pageOrientation').style.display = 'none';
            document.getElementById('pageDimension').style.display = '';
            diagram.pageSettings.width = 1460;
            diagram.pageSettings.height = 600;
        }
        let designContextMenu = (document.getElementById('designContextMenu') as any).ej2_instances[0];
        this.updatePaperSelection(designContextMenu.items[1], args.value);
        diagram.dataBind();
    };
    public updatePaperSelection(items: ContextMenuItemModel, value: string) {
        for (let i: number = 0; i < items.items.length; i++) {
            if (value === (items.items[i] as any).value) {
                items.items[i].iconCss = 'sf-icon-check-tick';
            }
            else {
                items.items[i].iconCss = '';
            }
        }
    };

    public textPropertyChange(propertyName: string, propertyValue: Object): void {
        if (!this.selectedItem.preventPropertyChange) {
            let diagram: Diagram = this.selectedItem.diagram;
            let selectedObjects: Object[] = diagram.selectedItems.nodes;
            selectedObjects = selectedObjects.concat(diagram.selectedItems.connectors);
            propertyName = propertyName.toLowerCase();
            if (selectedObjects.length > 0) {
                for (let i: number = 0; i < selectedObjects.length; i++) {
                    let node: Object = selectedObjects[i];
                    if ((node as ConnectorModel).type === undefined || (node as ConnectorModel).type !== undefined) {
                        if ((node as NodeModel).annotations.length > 0) {
                            for (let j: number = 0; j < (node as NodeModel).annotations.length; j++) {
                                let annotation: ShapeAnnotationModel | PathAnnotationModel = null;
                                if ((node as NodeModel).annotations[j] instanceof ShapeAnnotation) {
                                    annotation = (node as NodeModel).annotations[j] as ShapeAnnotationModel;
                                    if (propertyName === 'textposition') {
                                        this.selectedItem.textProperties.textPosition = propertyValue.toString();
                                        annotation.offset = this.selectedItem.utilityMethods.getOffset(propertyValue as string);
                                    }
                                } else if ((node as NodeModel).annotations[j] instanceof PathAnnotation) {
                                    annotation = (node as NodeModel).annotations[j] as PathAnnotationModel;
                                    if (propertyName === 'textposition') {
                                        this.selectedItem.textProperties.textPosition = propertyValue.toString();
                                        annotation.alignment = this.selectedItem.textProperties.textPosition as AnnotationAlignment;
                                    }
                                }
                                if (propertyName === 'left' || propertyName === 'right' || propertyName === 'center') {
                                    annotation.horizontalAlignment = propertyValue as HorizontalAlignment;
                                    this.selectedItem.utilityMethods.updateHorVertAlign(annotation.horizontalAlignment, annotation.verticalAlignment);
                                } else if (propertyName === 'top' || propertyName === 'bottom') {
                                    annotation.verticalAlignment = propertyValue as VerticalAlignment;
                                    this.selectedItem.utilityMethods.updateHorVertAlign(annotation.horizontalAlignment, annotation.verticalAlignment);
                                } else if (propertyName === 'middle') {
                                    annotation.verticalAlignment = 'Center';
                                    this.selectedItem.utilityMethods.updateHorVertAlign(annotation.horizontalAlignment, annotation.verticalAlignment);
                                } else {
                                    this.updateTextProperties(propertyName, propertyValue, annotation.style);
                                }
                            }
                        } else if ((node as NodeModel).shape && (node as NodeModel).shape.type === 'Text') {
                            this.updateTextProperties(propertyName, propertyValue, (node as NodeModel).style);
                        }
                    }
                }
                diagram.dataBind();
                this.selectedItem.isModified = true;
            }
        }
    };

    public toolbarTextStyleChange(args: ToolbarClickEventArgs): void {
        this.textPropertyChange(args.item.tooltipText, false);
    };
    public toolbarTextSubAlignChange(args: ToolbarClickEventArgs): void {
        let propertyName: string = args.item.tooltipText.replace(/[' ']/g, '');
        this.textPropertyChange(propertyName, propertyName);
    };
    public toolbarTextAlignChange(args: ToolbarClickEventArgs): void {
        let propertyName: string = args.item.tooltipText.replace('Align ', '');
        if (propertyName === 'Top') {
            propertyName = 'Bottom';
        }
        else if (propertyName === 'Bottom') {
            propertyName = 'Top';
        }
        this.textPropertyChange(propertyName, propertyName);
    }
    public textPositionChange(args: DropDownChangeEventArgs): void {
        if (args.value !== null) {
            this.textPropertyChange('textPosition', args.value);
        }
    }
    public updateTextProperties(propertyName: string, propertyValue: Object, annotation: TextStyleModel): void {
        switch (propertyName) {
            case 'bold':
                annotation.bold = !annotation.bold;
                this.updateToolbarState('toolbarTextStyle', annotation.bold, 0);
                break;
            case 'italic':
                annotation.italic = !annotation.italic;
                this.updateToolbarState('toolbarTextStyle', annotation.italic, 1);
                break;
            case 'underline':
                this.selectedItem.textProperties.textDecoration = !this.selectedItem.textProperties.textDecoration;
                annotation.textDecoration = annotation.textDecoration === 'None' || !annotation.textDecoration ? 'Underline' : 'None';
                let dec = annotation.textDecoration === 'Underline' ? true : false
                this.updateToolbarState('toolbarTextStyle', dec, 2);
                break;
            case 'aligntextleft':
            case 'aligntextright':
            case 'aligntextcenter':
                annotation.textAlign = propertyValue.toString().replace('AlignText', '') as TextAlign;
                this.selectedItem.utilityMethods.updateTextAlign(annotation.textAlign);
                break;
        }
    };
    public updateToolbarState(toolbarName: string, isSelected: boolean, index: number) {
        let toolbarTextStyle: any = document.getElementById(toolbarName);
        if (toolbarTextStyle) {
            toolbarTextStyle = toolbarTextStyle.ej2_instances[0];
        }
        if (toolbarTextStyle) {
            let cssClass: string = toolbarTextStyle.items[index].cssClass;
            toolbarTextStyle.items[index].cssClass = isSelected ? cssClass + ' tb-item-selected' : cssClass.replace(' tb-item-selected', '');
            toolbarTextStyle.dataBind();
        }
    };
    public download(filename: string) {
        this.selectedItem.utilityMethods.download(this.selectedItem.diagram.saveDiagram(), filename);
    }
}
