export const resizeRight = (e, prevState, screenWidth) => {
    const movementX = e.clientX - prevState.prevX;
    let newWidth = prevState.width + movementX
    if(newWidth < 150)
    {
        newWidth = 150
    }
    if (newWidth > screenWidth - prevState.left)
    {
        newWidth = screenWidth - prevState.left
    }
    return {...prevState, width : newWidth, prevX : e.clientX}
}

export const resizeBottom = (e, prevState, screenHeight) => {
    const movementY = e.clientY - prevState.prevY;
    let newHeight = prevState.height + movementY
    if(newHeight < 100)
    {
        newHeight = 100
    }
    if (newHeight > screenHeight - prevState.top)
    {
        newHeight = screenHeight - prevState.top
    }
    return {...prevState, height : newHeight, prevY : e.clientY}
}

export const resizeLeft = (e, prevState, screenWidth) => {
    const movementX = e.clientX - prevState.prevX;
    let newLeft = prevState.left + movementX;
    let newWidth = prevState.width + (movementX * -1);
    if (newLeft <= 0)
    {
        newLeft = 0
        newWidth = prevState.width + prevState.left
    }
    else if (newWidth <= 150)
    {
        newLeft = prevState.left + (prevState.width - 150)
        newWidth = 150
    }
    else if (newWidth >= screenWidth)
    {
        newLeft = 0
        newWidth = screenWidth
    }
    return {...prevState, left : newLeft, width: newWidth, prevX : e.clientX}
}

export const resizeTop = (e, prevState, screenHeight) => {
    const movementY = e.clientY - prevState.prevY;
    let newTop = prevState.top + movementY;
    let newHeight = prevState.height + (movementY * -1);
    if (newTop <= 0)
    {
        newTop = 0
        newHeight = prevState.height + prevState.top
    }
    else if (newHeight <= 100)
    {
        newTop = prevState.top + (prevState.height - 100)
        newHeight = 100
    }
    else if (newHeight >= screenHeight)
    {
        newTop = 0
        newHeight = screenHeight
    }
    return {...prevState, top : newTop, height: newHeight, prevY : e.clientY}
}

export const defaultDimensions = (dWidth, dHeight, sWidth, sHeight) => {
    if(sWidth >= dWidth && sHeight >= dHeight){
        const leftInit = (sWidth / 2) - (dWidth / 2)
        const topInit =  (sHeight / 2) - (dHeight / 2)
        return ({left: leftInit, top: topInit, width: dWidth, height: dHeight, prevX : null, prevY : null})
    }
    else if(sWidth >= dWidth)
    {
        const leftInit = (sWidth / 2) - (dWidth / 2)
        return ({left: leftInit, top: 0, width: dWidth, height: sHeight, prevX : null, prevY : null})
    }
    else if(sHeight >= dHeight)
    {
        const topInit =  (sHeight / 2) - (dHeight / 2)
        return ({left: 0, top: topInit, width: sWidth, height: dHeight, prevX : null, prevY : null})
    }
    else{
        return ({left: 0, top: 0, width: sWidth, height: sHeight, prevX : null, prevY : null})
    }
}