import { useState, useReducer, useMemo } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const initialUsers = [
  {
    id: "USR-001", name: "Priya Sharma", email: "priya.sharma@gmail.com",
    phone: "+91 98765 43210", role: "Patient", status: "Active",
    joined: "2024-01-15", lastActive: "2025-05-20", isPrime: true,
    avatar: "PS", dob: "1990-06-12", gender: "Female", bloodGroup: "B+",
    appointments: 12, totalOrders: 34, totalSpent: 18450,
    addresses: [{ type: "Home", line: "12, Rajouri Garden, New Delhi - 110027", isDefault: true },
                { type: "Work", line: "Sector 62, Noida - 201301", isDefault: false }],
    familyMembers: [
      { id: "FM-001", name: "Rahul Sharma", relation: "Spouse", dob: "1988-03-22", phone: "+91 98765 11111" },
      { id: "FM-002", name: "Aarav Sharma", relation: "Son", dob: "2015-09-10", phone: "+91 98765 22222" },
    ],
    orders: [
      { id: "ORD-1001", date: "2025-05-18", items: [{ name: "Paracetamol 500mg", qty: 30, price: 45 }, { name: "Vitamin D3", qty: 60, price: 320 }], total: 365, status: "Delivered", address: "12, Rajouri Garden, New Delhi - 110027", payment: "UPI" },
      { id: "ORD-1002", date: "2025-04-30", items: [{ name: "Azithromycin 500mg", qty: 5, price: 180 }], total: 180, status: "Delivered", address: "12, Rajouri Garden, New Delhi - 110027", payment: "Card" },
      { id: "ORD-1003", date: "2025-04-10", items: [{ name: "Metformin 500mg", qty: 60, price: 95 }], total: 95, status: "Cancelled", address: "12, Rajouri Garden, New Delhi - 110027", payment: "UPI" },
    ],
    payments: [
      { id: "PAY-2001", date: "2025-05-18", amount: 365, method: "UPI", status: "Success" },
      { id: "PAY-2002", date: "2025-04-30", amount: 180, method: "Card", status: "Success" },
      { id: "PAY-2003", date: "2025-04-10", amount: 95, method: "UPI", status: "Refunded" },
    ]
  },
  {
    id: "USR-002", name: "Amit Verma", email: "amit.verma@yahoo.com",
    phone: "+91 87654 32109", role: "Nurse", status: "Active",
    joined: "2023-11-08", lastActive: "2025-05-22", isPrime: false,
    avatar: "AV", dob: "1985-11-30", gender: "Male", bloodGroup: "O+",
    appointments: 28, totalOrders: 8, totalSpent: 4200,
    addresses: [{ type: "Home", line: "45, Lajpat Nagar, New Delhi - 110024", isDefault: true }],
    familyMembers: [
      { id: "FM-003", name: "Sunita Verma", relation: "Mother", dob: "1958-07-05", phone: "+91 87654 33333" },
    ],
    orders: [
      { id: "ORD-1004", date: "2025-05-10", items: [{ name: "Gloves (Latex) 100pcs", qty: 1, price: 350 }], total: 350, status: "Delivered", address: "45, Lajpat Nagar, New Delhi - 110024", payment: "Cash" },
    ],
    payments: [
      { id: "PAY-2004", date: "2025-05-10", amount: 350, method: "Cash", status: "Success" },
    ]
  },
  {
    id: "USR-003", name: "Sneha Patel", email: "sneha.patel@gmail.com",
    phone: "+91 76543 21098", role: "Patient", status: "Inactive",
    joined: "2024-03-22", lastActive: "2025-01-14", isPrime: false,
    avatar: "SP", dob: "1995-02-18", gender: "Female", bloodGroup: "A+",
    appointments: 3, totalOrders: 11, totalSpent: 6780,
    addresses: [{ type: "Home", line: "78, Dwarka Sector 7, New Delhi - 110075", isDefault: true }],
    familyMembers: [],
    orders: [
      { id: "ORD-1005", date: "2025-01-05", items: [{ name: "Omeprazole 20mg", qty: 30, price: 120 }], total: 120, status: "Delivered", address: "78, Dwarka Sector 7, New Delhi - 110075", payment: "UPI" },
    ],
    payments: [
      { id: "PAY-2005", date: "2025-01-05", amount: 120, method: "UPI", status: "Success" },
    ]
  },
  {
    id: "USR-004", name: "Rohan Gupta", email: "rohan.g@hotmail.com",
    phone: "+91 65432 10987", role: "Patient", status: "Active",
    joined: "2023-07-19", lastActive: "2025-05-24", isPrime: true,
    avatar: "RG", dob: "1992-08-07", gender: "Male", bloodGroup: "AB-",
    appointments: 19, totalOrders: 47, totalSpent: 32100,
    addresses: [{ type: "Home", line: "22, Vasant Kunj, New Delhi - 110070", isDefault: true },
                { type: "Work", line: "Cyber City, Gurugram - 122002", isDefault: false }],
    familyMembers: [
      { id: "FM-004", name: "Meera Gupta", relation: "Spouse", dob: "1993-12-15", phone: "+91 65432 44444" },
      { id: "FM-005", name: "Aryan Gupta", relation: "Son", dob: "2018-04-20", phone: "+91 65432 55555" },
      { id: "FM-006", name: "Kavya Gupta", relation: "Daughter", dob: "2020-11-08", phone: "" },
    ],
    orders: [
      { id: "ORD-1006", date: "2025-05-21", items: [{ name: "Atorvastatin 10mg", qty: 30, price: 210 }, { name: "Aspirin 75mg", qty: 30, price: 65 }], total: 275, status: "Pending", address: "22, Vasant Kunj, New Delhi - 110070", payment: "Card" },
    ],
    payments: [
      { id: "PAY-2006", date: "2025-05-21", amount: 275, method: "Card", status: "Success" },
    ]
  },
  {
    id: "USR-005", name: "Kavita Nair", email: "kavita.nair@gmail.com",
    phone: "+91 54321 09876", role: "Patient", status: "Active",
    joined: "2024-08-05", lastActive: "2025-05-19", isPrime: false,
    avatar: "KN", dob: "1988-04-25", gender: "Female", bloodGroup: "O-",
    appointments: 7, totalOrders: 15, totalSpent: 9300,
    addresses: [{ type: "Home", line: "56, Saket, New Delhi - 110017", isDefault: true }],
    familyMembers: [
      { id: "FM-007", name: "Suresh Nair", relation: "Father", dob: "1960-09-12", phone: "+91 54321 66666" },
    ],
    orders: [],
    payments: []
  },
];

// ─── REDUCER ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case "SET_PAGE": return { ...state, page: action.payload, selectedOrder: null };
    case "SELECT_USER": return { ...state, selectedUser: action.payload, page: "detail", selectedOrder: null };
    case "SELECT_ORDER": return { ...state, selectedOrder: action.payload, page: "orderDetail" };
    case "TOGGLE_STATUS": return {
      ...state,
      users: state.users.map(u => u.id === action.payload ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u),
      selectedUser: state.selectedUser?.id === action.payload
        ? { ...state.selectedUser, status: state.selectedUser.status === "Active" ? "Inactive" : "Active" }
        : state.selectedUser
    };
    case "UPGRADE_PRIME": return {
      ...state,
      users: state.users.map(u => u.id === action.payload ? { ...u, isPrime: true } : u),
      selectedUser: state.selectedUser?.id === action.payload ? { ...state.selectedUser, isPrime: true } : state.selectedUser
    };
    case "UPDATE_USER_FIELD": return {
      ...state,
      users: state.users.map(u => u.id === action.id ? { ...u, [action.field]: action.value } : u),
      selectedUser: state.selectedUser?.id === action.id ? { ...state.selectedUser, [action.field]: action.value } : state.selectedUser
    };
    case "ADD_FAMILY": {
      const member = { id: `FM-${Date.now()}`, ...action.payload };
      return {
        ...state,
        users: state.users.map(u => u.id === action.userId ? { ...u, familyMembers: [...u.familyMembers, member] } : u),
        selectedUser: state.selectedUser?.id === action.userId ? { ...state.selectedUser, familyMembers: [...state.selectedUser.familyMembers, member] } : state.selectedUser
      };
    }
    case "EDIT_FAMILY": return {
      ...state,
      users: state.users.map(u => u.id === action.userId ? { ...u, familyMembers: u.familyMembers.map(m => m.id === action.member.id ? action.member : m) } : u),
      selectedUser: state.selectedUser?.id === action.userId ? { ...state.selectedUser, familyMembers: state.selectedUser.familyMembers.map(m => m.id === action.member.id ? action.member : m) } : state.selectedUser
    };
    case "DELETE_FAMILY": return {
      ...state,
      users: state.users.map(u => u.id === action.userId ? { ...u, familyMembers: u.familyMembers.filter(m => m.id !== action.memberId) } : u),
      selectedUser: state.selectedUser?.id === action.userId ? { ...state.selectedUser, familyMembers: state.selectedUser.familyMembers.filter(m => m.id !== action.memberId) } : state.selectedUser
    };
    case "ADD_USER": return { ...state, users: [action.payload, ...state.users] };
    default: return state;
  }
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const avatarColors = ["#4F7EFF","#FF6B6B","#43C59E","#F5A623","#9B59B6","#1ABC9C","#E74C3C","#3498DB"];
const getColor = (name) => avatarColors[name.charCodeAt(0) % avatarColors.length];

const statusBadge = (s) => {
  const styles = { Active: { bg: "#ECFDF5", color: "#059669" }, Inactive: { bg: "#FEF2F2", color: "#DC2626" }, Delivered: { bg: "#ECFDF5", color: "#059669" }, Pending: { bg: "#FFFBEB", color: "#D97706" }, Cancelled: { bg: "#FEF2F2", color: "#DC2626" }, Success: { bg: "#ECFDF5", color: "#059669" }, Refunded: { bg: "#EEF2FF", color: "#4338CA" } };
  const s2 = styles[s] || { bg: "#F3F4F6", color: "#6B7280" };
  return <span style={{ background: s2.bg, color: s2.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>{s}</span>;
};

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  app: { fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#F0F2F7", minHeight: "100vh", color: "#1A1D2E" },
  sidebar: { width: 220, background: "#1A1D2E", minHeight: "100vh", padding: "0 0 24px", display: "flex", flexDirection: "column", flexShrink: 0 },
  logo: { padding: "24px 20px 20px", borderBottom: "1px solid #2D3148" },
  logoText: { fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: -0.5 },
  logoSub: { fontSize: 11, color: "#6B7FA8", marginTop: 2, letterSpacing: 1, textTransform: "uppercase" },
  navItem: (active) => ({ display: "flex", alignItems: "center", gap: 10, padding: "11px 20px", cursor: "pointer", color: active ? "#fff" : "#8A9BBE", background: active ? "#4F7EFF" : "transparent", borderRadius: active ? "0 8px 8px 0" : 0, margin: "2px 0 2px 0", fontSize: 14, fontWeight: active ? 600 : 400, transition: "all .15s" }),
  main: { flex: 1, padding: "28px 32px", overflow: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  pageTitle: { fontSize: 24, fontWeight: 800, color: "#1A1D2E", letterSpacing: -0.5 },
  pageSub: { fontSize: 13, color: "#6B7FA8", marginTop: 2 },
  card: { background: "#fff", borderRadius: 14, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,.06)" },
  statCard: { background: "#fff", borderRadius: 14, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,.06)", flex: "1 1 0" },
  statVal: { fontSize: 32, fontWeight: 800, letterSpacing: -1, marginBottom: 4 },
  statLabel: { fontSize: 13, color: "#6B7FA8", fontWeight: 500 },
  btn: (variant = "primary") => ({
    padding: "9px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
    background: variant === "primary" ? "#4F7EFF" : variant === "danger" ? "#FEF2F2" : variant === "ghost" ? "transparent" : "#F0F2F7",
    color: variant === "primary" ? "#fff" : variant === "danger" ? "#DC2626" : variant === "ghost" ? "#4F7EFF" : "#374151",
    transition: "all .15s"
  }),
  input: { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#FAFAFA" },
  select: { padding: "9px 12px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 13, background: "#fff", cursor: "pointer", outline: "none" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7FA8", background: "#F8F9FC", textTransform: "uppercase", letterSpacing: .5 },
  td: { padding: "14px 16px", fontSize: 14, borderBottom: "1px solid #F0F2F7", verticalAlign: "middle" },
  avatar: (name, size = 36) => ({ width: size, height: size, borderRadius: "50%", background: getColor(name), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.36, flexShrink: 0 }),
  tab: (active) => ({ padding: "10px 20px", borderBottom: active ? "2.5px solid #4F7EFF" : "2.5px solid transparent", color: active ? "#4F7EFF" : "#6B7FA8", fontWeight: active ? 700 : 500, cursor: "pointer", fontSize: 14, background: "none", border: "none", borderBottom: active ? "2.5px solid #4F7EFF" : "2.5px solid transparent" }),
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modalBox: { background: "#fff", borderRadius: 16, padding: 28, width: 440, maxWidth: "95vw", boxShadow: "0 20px 60px rgba(0,0,0,.2)" },
};

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={S.modal} onClick={onClose}>
      <div style={S.modalBox} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 17, fontWeight: 700 }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6B7FA8" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── ADD USER MODAL ───────────────────────────────────────────────────────────
function AddUserModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "Patient", dob: "", gender: "Male", bloodGroup: "B+" });
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const submit = () => {
    if (!form.name || !form.email) return;
    onAdd({ ...form, id: `USR-${Date.now()}`, status: "Active", joined: new Date().toISOString().slice(0, 10), lastActive: new Date().toISOString().slice(0, 10), isPrime: false, avatar: form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2), appointments: 0, totalOrders: 0, totalSpent: 0, addresses: [], familyMembers: [], orders: [], payments: [] });
    onClose();
  };
  const row = { marginBottom: 14 };
  const label = { fontSize: 12, fontWeight: 600, color: "#6B7FA8", marginBottom: 5, display: "block" };
  return (
    <Modal title="Add New User" onClose={onClose}>
      <div style={row}><label style={label}>Full Name *</label><input style={S.input} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Priya Sharma" /></div>
      <div style={row}><label style={label}>Email *</label><input style={S.input} value={form.email} onChange={e => set("email", e.target.value)} placeholder="email@example.com" /></div>
      <div style={row}><label style={label}>Phone</label><input style={S.input} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" /></div>
      <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
        <div style={{ flex: 1 }}><label style={label}>Role</label><select style={{ ...S.select, width: "100%" }} value={form.role} onChange={e => set("role", e.target.value)}><option>Patient</option><option>Nurse</option></select></div>
        <div style={{ flex: 1 }}><label style={label}>Gender</label><select style={{ ...S.select, width: "100%" }} value={form.gender} onChange={e => set("gender", e.target.value)}><option>Male</option><option>Female</option><option>Other</option></select></div>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1 }}><label style={label}>DOB</label><input type="date" style={S.input} value={form.dob} onChange={e => set("dob", e.target.value)} /></div>
        <div style={{ flex: 1 }}><label style={label}>Blood Group</label><select style={{ ...S.select, width: "100%" }} value={form.bloodGroup} onChange={e => set("bloodGroup", e.target.value)}>{["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(g => <option key={g}>{g}</option>)}</select></div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button style={S.btn("secondary")} onClick={onClose}>Cancel</button>
        <button style={S.btn("primary")} onClick={submit}>Add User</button>
      </div>
    </Modal>
  );
}

// ─── FAMILY MEMBER MODAL ──────────────────────────────────────────────────────
function FamilyModal({ member, onClose, onSave }) {
  const [form, setForm] = useState(member || { name: "", relation: "Spouse", dob: "", phone: "" });
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const row = { marginBottom: 14 };
  const label = { fontSize: 12, fontWeight: 600, color: "#6B7FA8", marginBottom: 5, display: "block" };
  return (
    <Modal title={member ? "Edit Family Member" : "Add Family Member"} onClose={onClose}>
      <div style={row}><label style={label}>Full Name *</label><input style={S.input} value={form.name} onChange={e => set("name", e.target.value)} /></div>
      <div style={row}><label style={label}>Relationship</label><select style={{ ...S.select, width: "100%" }} value={form.relation} onChange={e => set("relation", e.target.value)}>{["Spouse","Son","Daughter","Father","Mother","Sibling","Other"].map(r => <option key={r}>{r}</option>)}</select></div>
      <div style={row}><label style={label}>Date of Birth</label><input type="date" style={S.input} value={form.dob} onChange={e => set("dob", e.target.value)} /></div>
      <div style={{ marginBottom: 20 }}><label style={label}>Phone</label><input style={S.input} value={form.phone} onChange={e => set("phone", e.target.value)} /></div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button style={S.btn("secondary")} onClick={onClose}>Cancel</button>
        <button style={S.btn("primary")} onClick={() => { if (form.name) { onSave(form); onClose(); } }}>Save</button>
      </div>
    </Modal>
  );
}

// ─── USER LIST PAGE ───────────────────────────────────────────────────────────
function UserListPage({ state, dispatch }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const { users } = state;

  const filtered = useMemo(() => users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q);
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    return matchSearch && matchStatus;
  }), [users, search, statusFilter]);

  const totalFM = users.reduce((s, u) => s + u.familyMembers.length, 0);
  const prime = users.filter(u => u.isPrime).length;

  const stats = [
    { label: "Total Users", value: users.length, color: "#4F7EFF", icon: "👥" },
    { label: "Prime Users", value: prime, color: "#F5A623", icon: "⭐" },
    { label: "Non-Prime Users", value: users.length - prime, color: "#43C59E", icon: "👤" },
    { label: "Total Family Members", value: totalFM, color: "#9B59B6", icon: "🏠" },
  ];

  return (
    <div>
      {showAdd && <AddUserModal onClose={() => setShowAdd(false)} onAdd={p => dispatch({ type: "ADD_USER", payload: p })} />}
      <div style={S.header}>
        <div>
          <div style={S.pageTitle}>User Management</div>
          <div style={S.pageSub}>Manage all registered users</div>
        </div>
        <button style={S.btn("primary")} onClick={() => setShowAdd(true)}>+ Add User</button>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        {stats.map(s => (
          <div key={s.label} style={S.statCard}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ ...S.statVal, color: s.color }}>{s.value}</div>
            <div style={S.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <input style={{ ...S.input, maxWidth: 280 }} placeholder="🔍  Search by name, email, phone…" value={search} onChange={e => setSearch(e.target.value)} />
          <select style={S.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option>All</option><option>Active</option><option>Inactive</option>
          </select>
          <div style={{ marginLeft: "auto", fontSize: 13, color: "#6B7FA8" }}>{filtered.length} users</div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead>
              <tr>{["User","Role","Status","Joined","Last Active","Appointments","Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{ transition: "background .1s" }} onMouseEnter={e => e.currentTarget.style.background = "#FAFBFF"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                  <td style={S.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={S.avatar(u.name)}>{u.avatar}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}{u.isPrime && <span style={{ marginLeft: 6, fontSize: 10, background: "#FFF8E7", color: "#D97706", padding: "2px 7px", borderRadius: 10, fontWeight: 700 }}>PRIME</span>}</div>
                        <div style={{ fontSize: 12, color: "#6B7FA8" }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={S.td}><span style={{ fontSize: 13, color: u.role === "Nurse" ? "#059669" : "#4F7EFF", fontWeight: 600 }}>{u.role}</span></td>
                  <td style={S.td}>{statusBadge(u.status)}</td>
                  <td style={S.td} style={{ ...S.td, fontSize: 13, color: "#6B7FA8" }}>{u.joined}</td>
                  <td style={S.td} style={{ ...S.td, fontSize: 13, color: "#6B7FA8" }}>{u.lastActive}</td>
                  <td style={S.td} style={{ ...S.td, fontWeight: 600 }}>{u.appointments}</td>
                  <td style={S.td}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{ ...S.btn("ghost"), padding: "6px 12px" }} onClick={() => dispatch({ type: "SELECT_USER", payload: u })}>View</button>
                      {!u.isPrime && <button style={{ ...S.btn("secondary"), padding: "6px 12px", fontSize: 12, color: "#D97706", background: "#FFF8E7" }} onClick={() => dispatch({ type: "UPGRADE_PRIME", payload: u.id })}>⭐ Prime</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: "48px 0", color: "#6B7FA8" }}>No users found.</div>}
        </div>
      </div>
    </div>
  );
}

// ─── ORDER DETAIL PAGE ────────────────────────────────────────────────────────
function OrderDetailPage({ order, user, dispatch }) {
  return (
    <div>
      <div style={S.header}>
        <div>
          <button style={{ ...S.btn("ghost"), padding: "6px 0", marginBottom: 6 }} onClick={() => dispatch({ type: "SET_PAGE", payload: "detail" })}>← Back to {user.name}</button>
          <div style={S.pageTitle}>Order {order.id}</div>
          <div style={S.pageSub}>{order.date}</div>
        </div>
        <div>{statusBadge(order.status)}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ ...S.card, gridColumn: "1 / -1" }}>
          <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Order Items</div>
          <table style={S.table}>
            <thead><tr><th style={S.th}>Medicine</th><th style={S.th}>Qty</th><th style={S.th}>Unit Price</th><th style={S.th}>Total</th></tr></thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td style={S.td}><div style={{ fontWeight: 600 }}>{item.name}</div></td>
                  <td style={S.td}>{item.qty}</td>
                  <td style={S.td}>{fmt(item.price)}</td>
                  <td style={S.td} style={{ ...S.td, fontWeight: 700 }}>{fmt(item.price * item.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ borderTop: "1px solid #F0F2F7", marginTop: 12, paddingTop: 12, textAlign: "right" }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#4F7EFF" }}>Total: {fmt(order.total)}</span>
          </div>
        </div>
        <div style={S.card}>
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Delivery Address</div>
          <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{order.address}</div>
          <div style={{ marginTop: 12, fontSize: 13, color: "#6B7FA8" }}>Status: <span style={{ fontWeight: 600, color: "#374151" }}>{order.status}</span></div>
        </div>
        <div style={S.card}>
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Payment Info</div>
          <div style={{ fontSize: 14, color: "#374151" }}>Method: <strong>{order.payment}</strong></div>
          <div style={{ fontSize: 14, color: "#374151", marginTop: 6 }}>Amount Paid: <strong style={{ color: "#059669" }}>{fmt(order.total)}</strong></div>
        </div>
      </div>
    </div>
  );
}

// ─── USER DETAIL PAGE ─────────────────────────────────────────────────────────
function UserDetailPage({ state, dispatch }) {
  const [activeTab, setActiveTab] = useState("orders");
  const [editField, setEditField] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [familyModal, setFamilyModal] = useState(null);
  const user = state.selectedUser;
  if (!user) return null;

  // Sync with latest from users array
  const fresh = state.users.find(u => u.id === user.id) || user;

  const startEdit = (field, val) => { setEditField(field); setEditVal(val); };
  const saveEdit = () => { if (editField) { dispatch({ type: "UPDATE_USER_FIELD", id: fresh.id, field: editField, value: editVal }); setEditField(null); } };

  const infoRow = (label, field, val) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #F0F2F7" }}>
      <span style={{ fontSize: 13, color: "#6B7FA8", width: 140, flexShrink: 0 }}>{label}</span>
      {editField === field
        ? <div style={{ display: "flex", gap: 8, flex: 1 }}><input style={{ ...S.input, flex: 1 }} value={editVal} onChange={e => setEditVal(e.target.value)} autoFocus /><button style={S.btn("primary")} onClick={saveEdit}>Save</button><button style={S.btn("secondary")} onClick={() => setEditField(null)}>×</button></div>
        : <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{val || "—"}</span>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#4F7EFF", fontSize: 12, fontWeight: 600 }} onClick={() => startEdit(field, val)}>Edit</button>
          </div>}
    </div>
  );

  return (
    <div>
      {familyModal !== undefined && familyModal !== false &&
        <FamilyModal member={familyModal === "new" ? null : familyModal}
          onClose={() => setFamilyModal(false)}
          onSave={m => familyModal === "new"
            ? dispatch({ type: "ADD_FAMILY", userId: fresh.id, payload: m })
            : dispatch({ type: "EDIT_FAMILY", userId: fresh.id, member: { ...familyModal, ...m } })} />}

      <div style={{ marginBottom: 20 }}>
        <button style={{ ...S.btn("ghost"), padding: "6px 0" }} onClick={() => dispatch({ type: "SET_PAGE", payload: "list" })}>← Back to Users</button>
      </div>

      {/* Profile Header */}
      <div style={{ ...S.card, display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ ...S.avatar(fresh.name, 72), fontSize: 26 }}>{fresh.avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 22, fontWeight: 800 }}>{fresh.name}</span>
            {fresh.isPrime && <span style={{ fontSize: 12, background: "#FFF8E7", color: "#D97706", padding: "3px 10px", borderRadius: 12, fontWeight: 700 }}>⭐ PRIME</span>}
            {statusBadge(fresh.status)}
          </div>
          <div style={{ fontSize: 13, color: "#6B7FA8", marginTop: 4 }}>{fresh.role} · {fresh.id}</div>
          <div style={{ fontSize: 13, color: "#6B7FA8" }}>{fresh.email} · {fresh.phone}</div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {!fresh.isPrime && <button style={{ ...S.btn("secondary"), background: "#FFF8E7", color: "#D97706", border: "1px solid #FDE68A" }} onClick={() => dispatch({ type: "UPGRADE_PRIME", payload: fresh.id })}>⭐ Upgrade to Prime</button>}
          <button style={{ ...S.btn(fresh.status === "Active" ? "danger" : "primary") }} onClick={() => dispatch({ type: "TOGGLE_STATUS", payload: fresh.id })}>{fresh.status === "Active" ? "Deactivate" : "Activate"}</button>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        {[["📦", "Total Orders", fresh.totalOrders, "#4F7EFF"], ["📅", "Appointments", fresh.appointments, "#43C59E"], ["👨‍👩‍👦", "Family Members", fresh.familyMembers.length, "#9B59B6"], ["💰", "Total Spent", fmt(fresh.totalSpent), "#F5A623"]].map(([icon, label, val, color]) => (
          <div key={label} style={{ ...S.statCard, flexBasis: 160 }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color, marginBottom: 2 }}>{val}</div>
            <div style={S.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Personal Info */}
        <div style={S.card}>
          <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 15 }}>Personal Information</div>
          {infoRow("Email", "email", fresh.email)}
          {infoRow("Phone", "phone", fresh.phone)}
          {infoRow("Date of Birth", "dob", fresh.dob)}
          {infoRow("Gender", "gender", fresh.gender)}
          {infoRow("Blood Group", "bloodGroup", fresh.bloodGroup)}
        </div>

        {/* Addresses */}
        <div style={S.card}>
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Addresses</div>
          {fresh.addresses.map((addr, i) => (
            <div key={i} style={{ background: "#F8F9FC", borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 12, background: "#E0E7FF", color: "#4F7EFF", padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>{addr.type}</span>
                {addr.isDefault && <span style={{ fontSize: 11, color: "#059669", fontWeight: 600 }}>Default</span>}
              </div>
              <div style={{ fontSize: 13, color: "#374151" }}>{addr.line}</div>
            </div>
          ))}
          {fresh.addresses.length === 0 && <div style={{ fontSize: 13, color: "#6B7FA8" }}>No addresses added.</div>}
        </div>
      </div>

      {/* Tabs */}
      <div style={S.card}>
        <div style={{ display: "flex", borderBottom: "1px solid #F0F2F7", marginBottom: 20 }}>
          {[["orders", "Order History"], ["payments", "Payment History"], ["family", `Family Members (${fresh.familyMembers.length})`]].map(([key, label]) => (
            <button key={key} style={S.tab(activeTab === key)} onClick={() => setActiveTab(key)}>{label}</button>
          ))}
        </div>

        {activeTab === "orders" && (
          <div style={{ overflowX: "auto" }}>
            <table style={S.table}>
              <thead><tr><th style={S.th}>Order ID</th><th style={S.th}>Date</th><th style={S.th}>Items</th><th style={S.th}>Amount</th><th style={S.th}>Status</th><th style={S.th}>Action</th></tr></thead>
              <tbody>
                {fresh.orders.map(o => (
                  <tr key={o.id}>
                    <td style={{ ...S.td, fontWeight: 600, color: "#4F7EFF" }}>{o.id}</td>
                    <td style={{ ...S.td, fontSize: 13, color: "#6B7FA8" }}>{o.date}</td>
                    <td style={S.td}><div style={{ fontSize: 13 }}>{o.items.map(i => `${i.name} × ${i.qty}`).join(", ")}</div></td>
                    <td style={{ ...S.td, fontWeight: 700 }}>{fmt(o.total)}</td>
                    <td style={S.td}>{statusBadge(o.status)}</td>
                    <td style={S.td}><button style={{ ...S.btn("ghost"), padding: "5px 10px" }} onClick={() => dispatch({ type: "SELECT_ORDER", payload: o })}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {fresh.orders.length === 0 && <div style={{ textAlign: "center", padding: 32, color: "#6B7FA8" }}>No orders yet.</div>}
          </div>
        )}

        {activeTab === "payments" && (
          <div style={{ overflowX: "auto" }}>
            <table style={S.table}>
              <thead><tr><th style={S.th}>Payment ID</th><th style={S.th}>Date</th><th style={S.th}>Amount</th><th style={S.th}>Method</th><th style={S.th}>Status</th></tr></thead>
              <tbody>
                {fresh.payments.map(p => (
                  <tr key={p.id}>
                    <td style={{ ...S.td, fontWeight: 600, color: "#4F7EFF" }}>{p.id}</td>
                    <td style={{ ...S.td, fontSize: 13, color: "#6B7FA8" }}>{p.date}</td>
                    <td style={{ ...S.td, fontWeight: 700 }}>{fmt(p.amount)}</td>
                    <td style={S.td}><span style={{ fontSize: 13, background: "#F0F2F7", padding: "3px 10px", borderRadius: 8, fontWeight: 600 }}>{p.method}</span></td>
                    <td style={S.td}>{statusBadge(p.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {fresh.payments.length === 0 && <div style={{ textAlign: "center", padding: 32, color: "#6B7FA8" }}>No payment history.</div>}
          </div>
        )}

        {activeTab === "family" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
              <button style={S.btn("primary")} onClick={() => setFamilyModal("new")}>+ Add Member</button>
            </div>
            <table style={S.table}>
              <thead><tr><th style={S.th}>Name</th><th style={S.th}>Relation</th><th style={S.th}>DOB</th><th style={S.th}>Phone</th><th style={S.th}>Actions</th></tr></thead>
              <tbody>
                {fresh.familyMembers.map(m => (
                  <tr key={m.id}>
                    <td style={S.td}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={S.avatar(m.name, 30)}>{m.name.split(" ").map(w => w[0]).join("").slice(0, 2)}</div><span style={{ fontWeight: 600 }}>{m.name}</span></div></td>
                    <td style={{ ...S.td, fontSize: 13 }}>{m.relation}</td>
                    <td style={{ ...S.td, fontSize: 13, color: "#6B7FA8" }}>{m.dob || "—"}</td>
                    <td style={{ ...S.td, fontSize: 13 }}>{m.phone || "—"}</td>
                    <td style={S.td}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button style={{ ...S.btn("ghost"), padding: "5px 10px" }} onClick={() => setFamilyModal(m)}>Edit</button>
                        <button style={{ ...S.btn("danger"), padding: "5px 10px" }} onClick={() => dispatch({ type: "DELETE_FAMILY", userId: fresh.id, memberId: m.id })}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {fresh.familyMembers.length === 0 && <div style={{ textAlign: "center", padding: 32, color: "#6B7FA8" }}>No family members added.</div>}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(reducer, {
    users: initialUsers, page: "list", selectedUser: null, selectedOrder: null
  });

  const navItems = [
    { icon: "🏠", label: "Dashboard", page: "list" },
    { icon: "👥", label: "Users", page: "list" },
  ];

  return (
    <div style={{ ...S.app, display: "flex" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; } ::-webkit-scrollbar { width: 6px; height: 6px } ::-webkit-scrollbar-track { background: #F0F2F7 } ::-webkit-scrollbar-thumb { background: #C4CAD4; border-radius: 3px }`}</style>

      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={S.logo}>
          <div style={S.logoText}>MediAdmin</div>
          <div style={S.logoSub}>Healthcare CRM</div>
        </div>
        <div style={{ padding: "16px 0 8px" }}>
          {navItems.map(n => (
            <div key={n.label} style={S.navItem(state.page === n.page || (n.page === "list" && ["detail","orderDetail"].includes(state.page)))} onClick={() => dispatch({ type: "SET_PAGE", payload: n.page })}>
              <span>{n.icon}</span><span>{n.label}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: "1px solid #2D3148" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#4F7EFF", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>AD</div>
            <div>
              <div style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>Admin</div>
              <div style={{ fontSize: 11, color: "#6B7FA8" }}>Super Admin</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={S.main}>
        {state.page === "list" && <UserListPage state={state} dispatch={dispatch} />}
        {state.page === "detail" && <UserDetailPage state={state} dispatch={dispatch} />}
        {state.page === "orderDetail" && state.selectedOrder && <OrderDetailPage order={state.selectedOrder} user={state.selectedUser} dispatch={dispatch} />}
      </div>
    </div>
  );
}
