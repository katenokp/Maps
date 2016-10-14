function calculateAllWeightRecursive(idItem){
    var children = getChildren(idItem);

    if(children == null)
        return getWeight(idItem);

    var weight = new Weight(0, 0);
    for(var i=0; i<children.length; i++)
        weight = sumWeights(weight, calculateAllWeightRecursive(children[i].id));
    return weight;

}

function recalculateWeightForItem(idItem){
    var idWeight = getNodeId(idItem) + '_indexInput';
    document.getElementById(idWeight).value = getWeightString(calculateWeight(idItem));

}

function calculateWeight(idItem){
    var children = getChildren(idItem);

    if(children == null)
        return getWeight(idItem);

    return sumWeightsAllChildren(children);
}


function sumWeightsAllChildren(children){
    var weight = new Weight(0, 0);
    for(var i=0; i<children.length; i++){
        weight = sumWeights(weight, getWeight(children[i].id));
    }
    return weight;
}

function Weight(done, all){
    this.done = done;
    this.all = all;
}

function sumWeights(firstWeight, secondWeight){
    if(firstWeight == null)
        firstWeight = new Weight(0, 0);
    if(secondWeight == null)
        secondWeight = new Weight(0, 0);
    return new Weight(firstWeight.done + secondWeight.done, firstWeight.all + secondWeight.all);
}

