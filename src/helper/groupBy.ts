export const groupBy = function (items: any[], key: string) {
    return items.reduce(function (prev, current) {
        // ? removes gameId
        let {gameId, ...newCurrent} = current;
        (prev[current[key]] = prev[current[key]] || []).push(newCurrent);
        return prev;
    }, {});
};