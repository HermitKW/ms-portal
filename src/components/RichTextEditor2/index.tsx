import '@wangeditor/editor/dist/css/style.css';

import React, { useState, useEffect } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, IEditorConfig, IToolbarConfig, createEditor } from '@wangeditor/editor';
import { i18nChangeLanguage } from '@wangeditor/editor'
function MyEditor() {
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [html, setHtml] = useState('<p>hello</p>');
  i18nChangeLanguage('en')
  useEffect(() => {
    setTimeout(() => {
      setHtml('<p>hello world</p>');
    }, 1500);
  }, []);

  const toolbarConfig: Partial<IToolbarConfig> = {};
  toolbarConfig.excludeKeys = ['group-image', 'group-video','insertLink','emotion', 'fontFamily'];
  
  const editorConfig: Partial<IEditorConfig> = {
    
    placeholder: 'Content...',
    MENU_CONF: {}
  };

/* editorConfig.MENU_CONF['fontFamily'] = {
  fontFamilyList: [
      'Arial',
      'Courier New',
      'Times New Roman',
      'Tahoma',
      'Verdana',
      { name: '微軟雅黑', value: '微软雅黑' },
      { name: '黑體', value: '黑体' },
      { name: '仿宋', value: '仿宋' },
      { name: '楷體', value: '楷体' },

  ]
} */
  
/* const editorDefault = createEditor({
  selector: '#editor-container',
  html: '<p></p>',
  content: [
    {
      children: [
        
      ]
    },
  ],
  config: editorConfig,
  mode: 'default',
}) */
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor: IDomEditor) => setHtml(editor.getHtml())}
          mode="default"
          style={{ height: '500px', overflowY: 'hidden' }}
        />
      </div>
      <div style={{ marginTop: '15px' }}>{html}</div>
    </>
  );
}

export default MyEditor;