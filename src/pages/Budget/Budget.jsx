import React, { useState, useEffect } from "react";
import "./Budget.css";

export default function Budget() {
  const defaultCategories = [
    { id: 1, name: "식비", amount: "0" },
    { id: 2, name: "교통비", amount: "0" },
    { id: 3, name: "취미", amount: "0" },
    { id: 4, name: "쇼핑", amount: "0" },
    { id: 5, name: "고정비", amount: "0" },
    { id: 6, name: "저축", amount: "0" },
    { id: 7, name: "기타", amount: "0" },
  ];

  // 초기값: localStorage에 있으면 가져오고 없으면 기본값 사용
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("budgetCategories");
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempCategories, setTempCategories] = useState([...categories]);

  // 저장 시 localStorage에도 저장
  const handleSaveClick = () => {
    setCategories([...tempCategories]);
    localStorage.setItem("budgetCategories", JSON.stringify(tempCategories));
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setTempCategories([...categories]);
  };

  const handleInputChange = (id, field, value) => {
    setTempCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, [field]: value } : cat
      )
    );
  };

  const getTotalBudget = (list) =>
    list.reduce((sum, cat) => sum + parseInt(cat.amount || 0), 0);

  const totalBudget = isEditing
    ? getTotalBudget(tempCategories)
    : getTotalBudget(categories);

  return (
    <div className="budget-wrapper">
      {/* 상단 예산 그래프 */}
      <section className="budget-graph-section">
        <h2 className="section-title">예산 설정 내역</h2>
        <div className="budget-graph">
          <div className="graph-bar">
            {(isEditing ? tempCategories : categories).map((cat, idx) => {
              const percent =
                totalBudget > 0
                  ? (parseInt(cat.amount || 0) / totalBudget) * 100
                  : 0;
              return (
                <div
                  key={idx}
                  className="graph-segment"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: `hsl(${idx * 50}, 70%, 70%)`,
                  }}
                  title={`${cat.name}: ${cat.amount}원 (${percent.toFixed(1)}%)`}
                ></div>
              );
            })}
          </div>
          <div className="graph-total">총예산: {totalBudget.toLocaleString()}원</div>
        </div>
      </section>

      {/* 하단 세부 예산 */}
      <section className="budget-detail-section">
        <div className="detail-header">
          <h2 className="section-title">세부 예산</h2>

          {/* 같은 위치에 수정/저장 버튼 */}
          {!isEditing ? (
            <button className="edit-btn" onClick={handleEditClick}>
              ✏️ 수정
            </button>
          ) : (
            <button className="save-btn" onClick={handleSaveClick}>
              💾 저장
            </button>
          )}
        </div>

        <div className="category-list">
          {(isEditing ? tempCategories : categories).map((cat) => {
            const percent =
              totalBudget > 0
                ? (parseInt(cat.amount || 0) / totalBudget) * 100
                : 0;
            return (
              <div key={cat.id} className="category-item">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) =>
                        handleInputChange(cat.id, "name", e.target.value)
                      }
                      className="category-input name-input"
                    />
                    <input
                      type="number"
                      value={cat.amount}
                      onChange={(e) =>
                        handleInputChange(cat.id, "amount", e.target.value)
                      }
                      className="category-input amount-input"
                    />
                  </>
                ) : (
                  <>
                    <span className="category-name">{cat.name}</span>
                    <span className="category-amount">
                      {parseInt(cat.amount).toLocaleString()}원
                    </span>
                    <span className="category-percent">
                      ({percent.toFixed(1)}%)
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
