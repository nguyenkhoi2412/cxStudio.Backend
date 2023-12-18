export class arrayHelper {
  static insert = (arr, index, ...items) => {
    return [
      // part of the array before the specified index
      ...arr.slice(0, index),
      // inserted items
      ...items,
      // part of the array after the specified index
      ...arr.slice(index),
    ];
  };

  static update = (arr, newItem, field = "_id") => {
    var itemField = Array.isArray(newItem) ? newItem[0] : newItem;

    if (Array.isArray(arr)) {
      return arr.map((item) => {
        if (item[field] === itemField[field]) {
          return {
            ...item,
            ...itemField,
          };
        }

        return item;
      });
    }

    return itemField;
  };

  static delete = (arr, objItems, field = "_id") => {
    return objItems.length
      ? objectExtension.diffArrayObjects(arr, objItems) // deleteMany
      : arr.filter((item) => {
          // deleteOne
          return item[field] !== objItems[field];
        });
  };

  //* shuffle array
  static shuffle = (array) => {
    let ctr = array.length;
    let temp;
    let index;

    // While there are elements in the array
    while (ctr > 0) {
      // Pick a random index
      index = Math.floor(Math.random() * ctr);
      // Decrease ctr by 1
      ctr--;
      // And swap the last element with it
      temp = array[ctr];
      array[ctr] = array[index];
      array[index] = temp;
    }
    return array;
  };

  //* build hierarchy
  static buildHierarchy = (
    array = [],
    idField = "_id",
    parentField = "parent"
  ) => {
    let arr = [...array];
    let arrMap = new Map(arr.map((item) => [item[idField], item]));
    let tree = [];
    let tempItem = [];

    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];

      if (item[parentField] !== "") {
        let parentItem = arrMap.get(item[parentField]);

        if (parentItem) {
          parentItem = {
            ...parentItem,
            children: [...parentItem.children, item],
          };

          tempItem.push(parentItem);
        }
      } else {
        tree.push(item);
      }
    }

    tempItem.map((item) => {
      tree = this.update(tree, item);
    });

    return tree;
  };
}
