import { ItemModel } from '@syncfusion/ej2-splitbuttons';
import { MenuItemModel, } from '@syncfusion/ej2-navigations';

export class DropDownDataSources {

  public getFileMenuItems: ItemModel[] = [
    { text: 'New', iconCss: 'sf-icon-new' },
    { text: 'Open', iconCss: 'sf-icon-open' },
    { text: 'Save', iconCss: 'sf-icon-save' },
    { text: 'Export', iconCss: 'sf-icon-export' },
    { text: 'Print', iconCss: 'sf-icon-print' },
  ];
  public getDesignMenuItems: MenuItemModel[] = [
    {
      text: 'Orientation', iconCss: 'sf-icon-page_orientation',
      items: [
        { text: 'Landscape', iconCss: 'sf-icon-check-tick' },
        { text: 'Portrait', iconCss: '' }
      ]
    },
    {
      text: 'Size', iconCss: 'em-icons e-copy',
      items: this.paperList1()
    }
  ];
  public getEditMenuItems: ItemModel[] = [{ text: 'Undo', iconCss: 'sf-icon-undo' },
  { text: 'Redo', iconCss: 'sf-icon-redo' },
  { text: 'Copy', iconCss: 'sf-icon-copy' },
  { text: 'Cut', iconCss: 'sf-icon-cut' },
  { text: 'Paste', iconCss: 'sf-icon-paste' },
  { text: 'Delete', iconCss: 'sf-icon-delete' }
  ];
  public getViewMenuItems: ItemModel[] = [
    { text: 'Show Rulers', iconCss: 'sf-icon-check-tick' },
    { text: 'Show Grid', iconCss: 'sf-icon-check-tick' },
    { text: 'Snap To Grid', iconCss: 'sf-icon-check-tick' },
    { text: 'Show Guides', iconCss: 'sf-icon-check-tick' },
    { text: 'Page Break' },
    { text: 'Fit To Screen' }
  ];

  public getInsertMenuItems: ItemModel[] = [
    { text: 'Insert Image', iconCss: 'sf-icon-insert_image ' },
    { text: 'Insert Link', iconCss: 'sf-icon-insert_link ' },
  ];

  public paperList1() {
    var items = [
      { text: 'Letter (8.5 in x 11 in)', value: 'Letter', iconCss: 'sf-icon-check-tick' }, { text: 'Legal (8.5 in x 14 in)', value: 'Legal' },
      { text: 'Tabloid (279 mm x 432 mm)', value: 'Tabloid' }, { text: 'A3 (297 mm x 420 mm)', value: 'A3' },
      { text: 'A4 (210 mm x 297 mm)', value: 'A4' }, { text: 'A5 (148 mm x 210 mm)', value: 'A5' },
      { text: 'A6 (105 mm x 148 mm)', value: 'A6' },
    ];
    return items
  };
  public conTypeItems: ItemModel[] = [
    { text: 'Straight', iconCss: 'sf-icon-straight_line' },
    { text: 'Orthogonal', iconCss: 'sf-icon-orthogonal_line' },
    { text: 'Bezier', iconCss: 'sf-icon-bezier' }
  ];
  public zoomMenuItems: ItemModel[] = [
    { text: 'Zoom In' }, { text: 'Zoom Out' }, { text: 'Zoom to Fit' }, { text: 'Zoom to 50%' },
    { text: 'Zoom to 100%' }, { text: 'Zoom to 200%' },
  ];

  public fileFormats: { [key: string]: Object }[] = [
    { text: 'JPG', value: 'JPG' }, { text: 'PNG', value: 'PNG' },
    { text: 'SVG', value: 'SVG' }
  ];
  public diagramRegions: { [key: string]: Object }[] = [
    { text: 'Content', value: 'Content' }, { text: 'PageSettings', value: 'PageSettings' }
  ];
  public paperList: { [key: string]: Object }[] = [
    { text: 'Letter (8.5 in x 11 in)', value: 'Letter' }, { text: 'Legal (8.5 in x 14 in)', value: 'Legal' },
    { text: 'Tabloid (279 mm x 432 mm)', value: 'Tabloid' }, { text: 'A3 (297 mm x 420 mm)', value: 'A3' },
    { text: 'A4 (210 mm x 297 mm)', value: 'A4' }, { text: 'A5 (148 mm x 210 mm)', value: 'A5' },
    { text: 'A6 (105 mm x 148 mm)', value: 'A6' }, { text: 'Custom', value: 'Custom' },
  ];
  public gradientDirections: { [key: string]: Object }[] = [
    { text: 'Bottom To Top', value: 'South' }, { text: 'Top To Bottom', value: 'North' },
    { text: 'Left To Right', value: 'East' }, { text: 'Right To Left', value: 'West' }
  ];
  public backgroundTypes = [
    { text: 'Solid', value: 'Solid' },
    { text: 'Gradient', value: 'Gradient' }
  ];
  public borderStyles = [
    { text: '', value: '', className: 'ddl-svg-style ddl_linestyle_none' },
    { text: '1,2', value: '1,2', className: 'ddl-svg-style ddl_linestyle_one_two' },
    { text: '3,3', value: '3,3', className: 'ddl-svg-style ddl_linestyle_three_three' },
    { text: '5,3', value: '5,3', className: 'ddl-svg-style ddl_linestyle_five_three' },
    { text: '4,4,1', value: '4,4,1', className: 'ddl-svg-style ddl_linestyle_four_four_one' }
  ];
  public lineStyles = [
    { text: '', value: '', className: 'ddl-svg-style ddl_linestyle_none' },
    { text: '2 2', value: '2 2', className: 'ddl-svg-style ddl_linestyle_one_two' },
    { text: '4 4', value: '4 4', className: 'ddl-svg-style ddl_linestyle_three_three' },
    { text: '5,3', value: '5,3', className: 'ddl-svg-style ddl_linestyle_five_three' },
    { text: '4,4,1', value: '4,4,1', className: 'ddl-svg-style ddl_linestyle_four_four_one' }
  ];
  public decoratorList = [
    { text: 'None', value: 'None' },
    { text: 'Arrow', value: 'Arrow' },
    { text: 'Diamond', value: 'Diamond' },
    { text: 'Open Arrow', value: 'OpenArrow' },
    { text: 'Circle', value: 'Circle' },
    { text: 'Square', value: 'Square' },
    { text: 'Fletch', value: 'Fletch' },
    { text: 'Open Fetch', value: 'OpenFetch' },
    { text: 'Indented Arrow', value: 'IndentedArrow' },
    { text: 'Outdented Arrow', value: 'OutdentedArrow' },
    { text: 'Double Arrow', value: 'DoubleArrow' }
  ];
  public fontFamilyList = [
    { text: 'Arial', value: 'Arial' },
    { text: 'Aharoni', value: 'Aharoni' },
    { text: 'Bell MT', value: 'Bell MT' },
    { text: 'Fantasy', value: 'Fantasy' },
    { text: 'Times New Roman', value: 'Times New Roman' },
    { text: 'Segoe UI', value: 'Segoe UI' },
    { text: 'Verdana', value: 'Verdana' },
  ];
}

