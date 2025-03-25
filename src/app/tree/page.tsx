import { JSX } from "react";

interface TreeNode {
  tag: string;
  children: TreeNode[];
}

export default function Tree() {
  const treeData: TreeNode[] = [
    {
      tag: 'html',
      children: [
        {
          tag: 'head',
          children: [
            { tag: 'title', children: [] },
            { tag: 'meta', children: [] }
          ]
        },
        {
          tag: 'body',
          children: [
            { tag: 'header', children: [] },
            {
              tag: 'main',
              children: [
                { tag: 'section', children: [] },
                { tag: 'article', children: [] }
              ]
            },
            { tag: 'footer', children: [] }
          ]
        }
      ]
    }
  ];

  const getColorForLevel = (level: number): string => {
    const colors = [
      'text-blue-400',
      'text-green-400',
      'text-teal-400',
      'text-indigo-400',
      'text-purple-400',
    ];
    return colors[level % colors.length];
  };

  const getBorderColorForLevel = (level: number): string => {
    const colors = [
      'border-blue-400',
      'border-green-400',
      'border-teal-400',
      'border-indigo-400',
      'border-purple-400',
    ];
    return colors[level % colors.length];
  };

  const renderTree = (node: TreeNode, level: number = 0): JSX.Element => (
    <ul
      className={`list-none pl-${level * 4} transition-all ${getColorForLevel(level)}`}
    >
      <li className="flex items-center">
        <div className={`mr-2 border-b-2 border-l-2 ${getBorderColorForLevel(level)} aspect-video ${level === 0 ? 'w-8' : 'w-6'}`} />
        <span>{node.tag}</span>
      </li>
      {node.children.length > 0 && (
        <ul className="ml-4">
          {node.children.map((child, index) => (
            <li key={index}>{renderTree(child, level + 1)}</li>
          ))}
        </ul>
      )}
    </ul>
  );

  return (
    <div className="max-w-md w-full mx-auto py-8 px-4 md:px-0">
      <h1 className="font-semibold text-xl mb-4">DOM Tree</h1>
      {treeData.map((rootNode, index) => (
        <div key={index} className="border-l-2 pl-4">
          {renderTree(rootNode)}
        </div>
      ))}
    </div>
  );
}