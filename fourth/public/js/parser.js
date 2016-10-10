var linesLevels;
var index;


function parse(data){
    var lines = data.text.split('\r\n');
    linesLevels = [];
    lines.forEach(function(line){
        linesLevels.push(getStringLevel(line));
    });
    return parseAll(linesLevels);
}

function parseAll(){ //todo rename
    var result = [];
    if(linesLevels[0].level != 0)
        throw error('Bad structure on position 0');

    index = 0;
    while(index<linesLevels.length){
        if(index == linesLevels.length-1) {
            result.push({
                name: linesLevels[index].line
            });
            index++;
        }
        else {
            result.push({
                name: linesLevels[index].line,
                children: findAllChildrenOfItem(index)
            });
        }
    }

    return result;


    /*while(index < linesLevels.length-1){
        var relationship = getRelationship(linesLevels[index], linesLevels[index+1])
        if(relationship == 'child'){


        }
    }
    while(getRelationship(linesLevels[0], linesLevels[index]) == 'child')
        index++;*/


}

function findAllChildrenOfItem(){
    var itemIndex = index;
    index ++;
    var children = [];
    while(index<linesLevels.length){
        var relationship = getRelationship(linesLevels[itemIndex], linesLevels[index]);
        if(relationship == 'child') {
            children.push({
                name: linesLevels[index].line
            });
            index++;
        }
        else if(relationship == 'childOfChild'){
            index--;
            children[children.length-1].children = findAllChildrenOfItem(linesLevels, index);
        }
        else if(relationship == 'neighbor'){
            return children;
        }
    }
    if(itemIndex+index==linesLevels.length)
        return children;
    if(getRelationship(linesLevels[itemIndex], linesLevels[itemIndex+index]) == 'child'){
        children[index].children = findAllChildrenOfItem(linesLevels+index);
    }

    return children;

}


function getRelationship(firstItem, secondItem){
    var levelsDifferent = firstItem.level - secondItem.level;
    if(levelsDifferent > 1 || levelsDifferent < -2)
        throw error('Bad structure, firstItem: {%s, %d}, secondItem: {%s, %d}', firstItem.line, firstItem.level, secondItem.line, secondItem.level);
    switch (levelsDifferent) {
        case  -1:
            return 'child';
        case  0:
            return 'neighbor';
        case  1:
            return 'nextNode';
        case -2:
            return "childOfChild";
    }
}



function getStringLevel(str){
    var regexp = /^(\t+)([\S]+)$/;
    var matches = str.match(regexp);
    if(matches == null)
        return {
            level: 0,
            line: str
        };
    return {
        level: matches[1].length,
        line: matches[2]
    }

}

module.exports = parse;