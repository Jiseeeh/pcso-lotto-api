export const groupBy = function (items: any[], key: string) {
    return items.reduce(function (prev, current) {
        (prev[current[key]] = prev[current[key]] || []).push(current);
        return prev;
    }, {});
};