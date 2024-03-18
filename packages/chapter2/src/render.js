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
  // newNode가 없고 oldNode만 있는 경우, oldNode를 제거
  if (!newNode && oldNode) {
    if (parent.childNodes[index]) {
      parent.removeChild(parent.childNodes[index]);
    }
    return;
  }

  // newNode가 있고 oldNode가 없는 경우, newNode를 생성하여 parent에 추가
  if (newNode && !oldNode) {
    parent.appendChild(createElement(newNode));
    return;
  }

  // newNode와 oldNode 둘 다 문자열이고 서로 다르면, oldNode를 newNode로 교체
  if (typeof newNode === 'string' && typeof oldNode === 'string' && newNode !== oldNode) {
    parent.childNodes[index].nodeValue = newNode;
    return;
  }

  // newNode와 oldNode의 타입이 다르면, oldNode를 newNode로 교체
  if (newNode.type !== oldNode.type) {
    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    return;
  }

  // newNode와 oldNode에 대해 updateAttributes 실행
  updateAttributes(parent.childNodes[index], newNode.props, oldNode ? oldNode.props : {});

  // 자식 노드들 처리. oldNode 또는 oldNode.children이 undefined일 수 있으므로 안전하게 접근
  const newChildren = newNode.children || [];
  const oldChildren = (oldNode && oldNode.children) ? oldNode.children : [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);
  for (let i = 0; i < maxLength; i++) {
    render(
      parent.childNodes[index],
      newChildren[i],
      oldChildren[i],
      i
    );
  }

  // 추가된 자식 노드들 처리 후 남은 노드들 제거
  while (parent.childNodes[index] && parent.childNodes[index].childNodes.length > maxLength) {
    parent.childNodes[index].removeChild(parent.childNodes[index].lastChild);
  }
}
