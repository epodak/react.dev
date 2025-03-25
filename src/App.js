import { useState } from 'react';

// Square组件：渲染单个棋格
// @param {string|null} value - 棋格中显示的值（'X'、'O'或null）
// @param {Function} onSquareClick - 点击棋格时的回调函数
// Square组件中的onSquareClick回调函数是由父组件Board通过props传入的
// 在Board组件中，通过 <Square onSquareClick={() => handleClick(i)} /> 的方式传入
// handleClick函数定义在Board组件内部，用于处理格子被点击的逻辑
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// 棋盘组件，接收是否轮到X下棋(xIsNext)、棋盘状态(squares)和下棋回调(onPlay)作为props
function Board({ xIsNext, squares, onPlay }) {
  // 处理点击棋格的函数
  function handleClick(i) {
    // 如果已经有赢家或该格子已经有棋子，直接返回
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // 创建棋盘状态的副本
    const nextSquares = squares.slice();
    // 根据当前玩家是X还是O来放置棋子
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    // 调用父组件传入的回调，更新棋盘状态
    onPlay(nextSquares);
  }

  // 计算是否有赢家
  const winner = calculateWinner(squares);
  let status;
  // 设置游戏状态信息：显示赢家或下一个玩家
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  // 渲染棋盘界面
  return (
    <>
      {/* 显示游戏状态 */}
      <div className="status">{status}</div>
      {/* 第一行棋格 */}
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      {/* 第二行棋格 */}
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      {/* 第三行棋格 */}
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// Game组件：井字棋游戏的主组件
export default function Game() {
  // 存储游戏历史记录的状态，初始值为一个只包含空值的9格数组
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // 当前所在的步数
  const [currentMove, setCurrentMove] = useState(0);
  // 根据当前步数判断是否轮到X下棋
  const xIsNext = currentMove % 2 === 0;
  // 获取当前步数对应的棋盘状态
  const currentSquares = history[currentMove];

  // 处理下棋操作的函数
  function handlePlay(nextSquares) {
    // 创建新的历史记录，包含当前步数之前的所有记录和新的棋盘状态
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    // 更新历史记录状态
    setHistory(nextHistory);
    // 将当前步数设置为最新一步
    setCurrentMove(nextHistory.length - 1);
  }

  // 跳转到指定步数的函数
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // 生成历史记录列表的JSX元素
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // 渲染游戏界面
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

/**
 * 判断是否有获胜者的函数
 * @param {Array} squares - 棋盘状态数组
 * @returns {string|null} 返回获胜者('X'或'O')或null(无获胜者)
 */
function calculateWinner(squares) {
  // 定义所有可能获胜的线条组合
  const lines = [
    [0, 1, 2], // 第一行
    [3, 4, 5], // 第二行
    [6, 7, 8], // 第三行
    [0, 3, 6], // 第一列
    [1, 4, 7], // 第二列
    [2, 5, 8], // 第三列
    [0, 4, 8], // 左上到右下对角线
    [2, 4, 6], // 右上到左下对角线
  ];

  // 遍历所有可能的获胜组合
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // 检查三个位置是否都被同一玩家占据
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  // 没有获胜者，返回null
  return null;
}
