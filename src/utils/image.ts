const mansonry = (items: any[], propName: string) => {
  return items.reduce(
    (p, c, k) => {
      if (k > 1) {
        if (p.leftHeight <= p.rightHeight) {
          return {
            ...p,
            leftCol: [...p.leftCol, c],
            leftHeight: p.leftHeight + c[propName],
          };
        }
        return {
          ...p,
          rightCol: [...p.rightCol, c],
          rightHeight: p.rightHeight + c[propName],
        };
      }
      return p;
    },
    {
      leftCol: [items[0]],
      rightCol: [items[1]],
      leftHeight: items[0].imageHeight,
      rightHeight: items[1].imageHeight,
    }
  )
}

export { mansonry }
