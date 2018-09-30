require.config({ paths: { 'vs': 'lib/monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], function () {
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false
    });

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2016,
        allowNonTsExtensions: true,
        noLib: true
    });

    let editorOptions = {
        value: '',
        language: 'javascript',
        scrollBeyondLastLine: false,
        theme: "vs-dark",
        minimap: {
            enabled: false
        },
        automaticLayout: true,
        wordWrap: "on",

    }

    if (sessionStorage.getItem('accessibility') === 'yes') {
        Object.assign(editorOptions, { accessibilitySupport: "on" })
    }

    window.puzzledEditor = monaco.editor.create(document.getElementById('editor'), editorOptions);

    window.addPuzzleLib = function (typeDefs) {
        monaco.languages.typescript.javascriptDefaults.addExtraLib(
            typeDefs, 'filename/puzzleDefs.d.ts');
    }

    window.getMarkers = function () {
        return monaco.editor.getModelMarkers({})
    }

    puzzledEditor._standaloneKeybindingService.addDynamicKeybinding("-actions.find")
});