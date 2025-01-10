import React from "react";

const CompletePage: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>응답해 주셔서 감사합니다!</h1>
      <p>이 설문조사에 참여해 주셔서 감사합니다.</p>

      <div style={{ marginTop: "50px" }}>
        <a href="/" className="text-blue-500">
          BusiForms 메인으로 가기
        </a>
      </div>
    </div>
  );
};

export default CompletePage;
