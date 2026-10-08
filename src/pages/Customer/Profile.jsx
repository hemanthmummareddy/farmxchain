import { useEffect, useState } from "react";
import API from "../../api/api";
import CustomerLayout from "../../Layouts/CustomerLayout";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get("/users/me").then((res) => {
      setUser(res.data);
      setPhone(res.data.phoneNumber || "");
      setAddress(res.data.address || "");
    });
  }, []);

  const saveProfile = async () => {
    try {
      setSaving(true);
      await API.put("/users/update", {
        phoneNumber: phone,
        address,
      });
      alert("Profile updated successfully");
    } catch {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <CustomerLayout>
        <div className="p-12 text-center text-gray-500">
          Loading profile…
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* HEADER */}
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-4xl font-black">
            {user.email[0].toUpperCase()}
          </div>

          <div>
            <h1 className="text-3xl font-black">
              {user.name || "Customer"}
            </h1>
            <p className="text-gray-500">{user.email}</p>
            <span className="inline-block mt-2 px-4 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">
              {user.role}
            </span>
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { label: "Total Orders", value: "—" },
            { label: "Active Orders", value: "—" },
            { label: "Account Status", value: "Active" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl shadow p-6 text-center"
            >
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-2xl font-black mt-1">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* PROFILE DETAILS */}
        <div className="bg-white rounded-2xl shadow p-8 grid md:grid-cols-2 gap-8">
          {/* LEFT */}
          <div className="space-y-5">
            <div>
              <label className="text-sm text-gray-500">
                Unique ID
              </label>
              <div className="mt-1 bg-gray-100 rounded-lg p-2 font-mono text-sm">
                {user.uniqueId}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Email
              </label>
              <input
                disabled
                value={user.email}
                className="mt-1 w-full border rounded-lg p-2 bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Role
              </label>
              <input
                disabled
                value={user.role}
                className="mt-1 w-full border rounded-lg p-2 bg-gray-100"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold">
                Phone Number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                placeholder="Delivery address"
                className="mt-1 w-full border rounded-lg p-2 resize-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="px-6 py-2 rounded-xl border font-semibold"
          >
            Logout
          </button>

          <button
            onClick={saveProfile}
            disabled={saving}
            className="px-8 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default Profile;
