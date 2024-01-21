const metaData = [
    {
        name : "Calorie Counter",
        info : ["This is my Calorie Counter Program. A standalone version can be found at the link below (will open a new tab)."],
        defaultDimensions : {defaultWidth: 720, defaultHeight : 800},
    },
    {
        name : "File Manager",
        info : ["This program allows you to access and manage the filesystem.\n\nClick on a folder to view its contents.\n\nClick on a program to start the program.\n\nClick on a file to open that file in its associated program.",
                "Right clicking opens a menu of options depending on what you click on.\n\nOn touch devices you can right click by pressing down for a few seconds.",
                "Right click in the dark region to add new folders and files.\n\nImages and pdf files will have to be \"downloaded\" from your computer.\n\n(These files are not sent over the internet)",
                "Right click on a file to delete it.\n\nRight click on a folder to delete it, or add it to the quick access menu on the left.\n\nRight click on a folder in the quick access menu to remove it from quick access.\n\nThe default folders and files can not be deleted.",
                "You can click on a folder name in the path to traverse to that folder.\n\nIf the current path becomes too large for its container, you can scroll though it."],
        defaultDimensions : {defaultWidth: 720, defaultHeight : 500},
    },
    {
        name : "PianoSynthJS",
        info : ["This is a simple Piano Synthesizer.\n\nBefore you can start playing the piano, you need at least one \"Sound\". Click on \"Add New Sound\".",
                "After clicking on \"Add New Sound\" you can change the sound's Octave, Volume, and Wave Type.\n\nYou can have multiple sounds, clicking on a sound will let you change its settings.",
                "Clicking play will play the sound continuously for testing purposes.\n\nTo play a single note simply click on a key on the piano.\n\nIf the program is currently in focus and your mouse is over the window, you can also use your keyboard.",
                "If you're on mobile and you can't hear anything, make sure your phone isn't on vibrate or mute.\n\nA standalone version can be found at the link below (will open a new tab)."
            ],
        defaultDimensions : {defaultWidth: 430, defaultHeight : 572},
    },
    {
        name : "Calculator",
        info : ["This is a simple Calculator."],
        defaultDimensions :  {defaultWidth: 390, defaultHeight : 510},
    },
    {
        name : "Image Viewer",
        info : ["You can zoom in or out by scrolling the mouse wheel over the image.\n\nClick on the picture to zoom in. Hold down CTRL and click to zoom out.\n\nYou can also select a zoom level from the Files menu.",
            "You can load a new image from the files menu. This will open a file manager to choose an image."],
        defaultDimensions : {defaultWidth: 720, defaultHeight : 500}
    },
    {
        //This should be renamed to pdf reader after filemanager is refactored
        name : "PDF Viewer",
        info : ["Currently this uses your browser's built in PDF reader.\n\nThis has mixed results depending on your browser.\n\nMobile users will likely have issues using this program.",
                "You can load a new PDF from the Files menu.\n\nThis will open a file manager to choose a PDF file."],
        defaultDimensions : {defaultWidth: 720, defaultHeight : 800}
    },
    {
        name : "Text Editor",
        info : ["This program allows you to create, load, and save text documents.\n\nThe Files menu has three options. New File, Save File and Load File.",
                "Clicking on \"New File\" will wipe the text document and remove its association with a file.\n\nYou will lose any unsaved progress on your current document.",
                "Clicking on \"Save File\" will save the currently loaded file.\n\nIf no file has been loaded yet, it will open a file manager to select a file to save to.\n\nRight click in file manager to create a new text document.",
                "Clicking on \"Load File\" will open a file manager to select a file to load."],
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