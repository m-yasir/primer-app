import React from "react";

export const useMount = (func) => React.useEffect(func, []);