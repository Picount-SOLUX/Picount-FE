import React, { useState } from "react";
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

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("budgetCategories");
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempCategories, setTempCategories] = useState([...categories]);
  const [newCategory, setNewCategory] = useState({ name: "", amount: "" });

  const getTotalBudget = (list) =>
    list.reduce((sum, cat) => sum + parseInt(cat.amount || 0), 0);

  const totalBudget = isEditing
    ? getTotalBudget(tempCategories)
    : getTotalBudget(categories);

  const handleEditClick = () => {
    setIsEditing(true);
    setTempCategories([...categories]);
  };

  const handleSaveClick = () => {
    setCategories([...tempCategories]);
    localStorage.setItem("budgetCategories", JSON.stringify(tempCategories));
    setIsEditing(false);
  };

  const handleInputChange = (id, field, value) => {
    setTempCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, [field]: value } : cat
      )
    );
  };

  // ✅ 카테고리 추가
  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    const nextId =
      tempCategories.length > 0
        ? Math.max(...tempCategories.map((c) => c.id)) + 1
        : 1;
    const newCat = {
      id: nextId,
      name: newCategory.name,
      amount: newCategory.amount || "0",
    };
    setTempCategories([...tempCategories, newCat]);
    setNewCategory({ name: "", amount: "" });
  };

  // ✅ 카테고리 삭제
  const handleDeleteCategory = (id) => {
    setTempCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

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
          <div className="graph-total">
            총예산: {totalBudget.toLocaleString()}원
          </div>
        </div>
      </section>

      {/* 하단 세부 예산 */}
      <section className="budget-detail-section">
        <div className="detail-header">
          <h2 className="section-title">세부 예산</h2>

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
                    <div className="category-controls">
                      <input
                        type="number"
                        value={cat.amount}
                        onChange={(e) =>
                          handleInputChange(cat.id, "amount", e.target.value)
                        }
                        className="category-input amount-input"
                      />
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteCategory(cat.id)}
                        title="삭제"
                      >
                        삭제
                      </button>
                    </div>
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

          {/* 수정 모드일 때만 추가 행 */}
          {isEditing && (
            <div className="category-item add-category-row">
              <input
                type="text"
                value={newCategory.name}
                placeholder="새 카테고리 이름"
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="category-input name-input"
              />
              {/* 🆕 오른쪽 컨트롤 묶기 */}
              <div className="category-controls">
                <input
                  type="number"
                  value={newCategory.amount}
                  placeholder="금액"
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, amount: e.target.value })
                  }
                  className="category-input amount-input"
                />
                <button
                  className="add-btn"
                  onClick={handleAddCategory}
                  title="카테고리 추가"
                >
                  추가
                </button>
              </div>
            </div>

          )}
        </div>
      </section>
    </div>
  );
}
