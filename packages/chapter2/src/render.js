export function jsx(type, props, ...children) {
  return { type, props: props || {}, children };
}


export function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }
  const element = document.createElement(node.type);
  Object.entries(node.props || {}).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });
  node.children.map(createElement).forEach(child => element.appendChild(child));
  return element;
}


function updateAttributes(target, newProps = {}, oldProps = {}) {
  Object.keys(oldProps).forEach(prop => {
    if (!newProps.hasOwnProperty(prop)) {
      target.removeAttribute(prop);
    }
  });

  Object.entries(newProps).forEach(([prop, value]) => {
    if (oldProps[prop] !== value) {
      target.setAttribute(prop, value);
    }
  });
}


export function render(parent, newNode, oldNode = null, index = 0) {
  // 1. 만약 newNode가 없고 oldNode만 있다면
  //   parent에서 oldNode를 제거
  //   종료
  if (!newNode && oldNode) {
    if (parent.childNodes[index]) {
      parent.removeChild(parent.childNodes[index]);
    }
    return;
  }

  // 2. 만약 newNode가 있고 oldNode가 없다면
  //   newNode를 생성하여 parent에 추가
  //   종료
  if (newNode && !oldNode) {
    parent.appendChild(createElement(newNode));
    return;
  }

  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if (typeof newNode === 'string' && typeof oldNode === 'string' && newNode !== oldNode) {
    parent.childNodes[index].nodeValue = newNode;
    return;
  }

  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if (newNode.type !== oldNode.type) {
    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    return;
  }

  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  updateAttributes(parent.childNodes[index], newNode.props, oldNode ? oldNode.props : {});

 
  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  //   각 자식노드에 대해 재귀적으로 render 함수 호출
  const newChildren = newNode.children || [];
  const oldChildren = oldNode?.children || [];
  
  const maxLength = Math.max(newChildren.length, oldChildren.length);
  for (let i = 0; i < maxLength; i++) {
    render(
      parent.childNodes[index],
      newChildren[i],
      oldChildren[i],
      i
    );
  }
  
}
