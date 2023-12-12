const metaData = [
    {
        name : "Calorie Counter",
        info : ["This is my Calorie Counter Program. A standalone version can be found at the link below (will open a new tab)."],
        defaultDimensions : {defaultWidth: 720, defaultHeight : 800},
    },
    {
        name : "File Manager",
        info : ["This is a file manager"],
        defaultDimensions : {defaultWidth: 720, defaultHeight : 500},
    },
    {
        name : "PianoSynthJS",
        info : ["This is a simple Piano Synthesizer"],
        defaultDimensions : {defaultWidth: 370, defaultHeight : 630},
    },
    {
        name : "Calculator",
        info : ["This is a simple Calculator."],
        defaultDimensions :  {defaultWidth: 390, defaultHeight : 510},
    },
    {
        name : "Image Viewer",
        info : ["You can zoom in or out by scrolling the mouse wheel over the image.\nClicking on the picture will zoom in and holding down CTRL while clicking will zoom out.",
            "You also have the option to select a zoom level from the Files menu.",
            "You can load a new image from the files menu. This will open a file manager to choose an image."],
        defaultDimensions : {defaultWidth: 720, defaultHeight : 500}
    },
    {
        name : "PDF Viewer",
        info : ["Currently this uses your browsers default pdf reader. This has mixed results depending on your browser. Mobile users will likely have issues using this program.",
                "You can load a new PDF from the files menu. This will open a file manager to choose a PDF."],
        defaultDimensions : {defaultWidth: 720, defaultHeight : 800}
    },
    {
        name : "Text Editor",
        info : ["This is a text editor. "],
        defaultDimensions : {defaultWidth: 720, defaultHeight : 600}
    },
]

// export const programIDs = {
//     CALORIECOUNTER : 0,
//     FILEMANAGER : 1,
//     PIANOSYNTHJS : 2,
//     CALCULATOR : 3,
//     IMAGEVIEWER : 4,
//     PDFREADER : 5,
//     TEXTEDITOR : 6,
// }

//File manager needs major refactoring before this will work
//For now we'll just have desktop menu set up for this to work later

export const programIDs = {
    CALORIECOUNTER : "Calorie Counter",
    FILEMANAGER : "File Manager",
    PIANOSYNTHJS : "PianoSynthJS",
    CALCULATOR : "Calculator",
    IMAGEVIEWER : "Image Viewer",
    PDFREADER : "PDF Viewer",
    TEXTEDITOR : "Text Editor",
}

export default metaData;