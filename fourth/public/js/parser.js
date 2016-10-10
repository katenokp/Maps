var linesLevels;
var index;


function parse(data){
    var lines = data.split('\r\n');
    linesLevels = [];
    lines.forEach(function(line){
        linesLevels.push(getStringLevel(line));
    });
    return parseAll(linesLevels);
}

function parseAll(){
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
        else if(relationship == 'neighbor' || 'nextNode'){
            return children;
        }
    }
    return children;

}


function getRelationship(firstItem, secondItem){
    var levelsDifferent = firstItem.level - secondItem.level;
    if(levelsDifferent < -2)
        console.log('Bad structure, firstItem: {%s, %d}, secondItem: {%s, %d}', firstItem.line, firstItem.level, secondItem.line, secondItem.level);
    switch (levelsDifferent) {
        case  -1:
            return 'child';
        case  0:
            return 'neighbor';
        case -2:
            return "childOfChild";
        default :
            return 'nextNode';
    }
}



function getStringLevel(str){
    var regexp = /^([ \t]+)[а-яА-Я\w].*$/;
    var matches = str.match(regexp);
    if(matches == null)
        return {
            level: 0,
            line: str
        };
    //console.log("for line %s level %d", matches[0], matches[1].length);
    return {
        level: matches[1].length,
        line: matches[0].replace('\t', '')
    }

}

module.exports = parse;
