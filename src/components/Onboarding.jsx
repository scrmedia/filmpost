import { useState } from "react";
import bcrypt from "bcryptjs";
import { supabase } from "../utils";
import { BusinessProfileFields } from "./BusinessProfileFields";

export function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", password: "", business_name: "",
    tagline: "", enquiry_email: "", website: "", instagram: "", tiktok: "", facebook: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from("users")
        .select("*")
        .eq("email", form.email)
        .single();
      if (err || !data) throw new Error("Invalid credentials");
      if (!data.password_hash) throw new Error("Account has no password set — please create a new account");
      const valid = await bcrypt.compare(form.password, data.password_hash);
      if (!valid) throw new Error("Invalid credentials");
      onComplete(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e?.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (step === 1) {
        if (!form.name || !form.email || !form.password) throw new Error("All fields required");
        setStep(2);
        setLoading(false);
        return;
      }
      if (!form.business_name) throw new Error("Business name required");
      const hash = await bcrypt.hash(form.password, 10);
      const { data, error: err } = await supabase
        .from("users")
        .insert([{
          name: form.name,
          email: form.email,
          password_hash: hash,
          business_name: form.business_name,
          tagline: form.tagline,
          enquiry_email: form.enquiry_email || form.email,
          website: form.website,
          instagram: form.instagram,
          tiktok: form.tiktok,
          facebook: form.facebook,
        }])
        .select()
        .single();
      if (err) throw new Error(err.message);
      onComplete(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="onboarding-logo">
          <h1>FilmPost</h1>
          <p>Automated publishing for wedding videographers</p>
        </div>

        <div className="card">
          <div className="card-body">
            {isLogin ? (
              <form onSubmit={handleLogin}>
                <div className="field">
                  <label className="label">Email</label>
                  <input 
                    className="input" 
                    type="email" 
                    value={form.email} 
                    onChange={e => update("email", e.target.value)} 
                    placeholder="you@example.com" 
                  />
                </div>
                <div className="field">
                  <label className="label">Password</label>
                  <input 
                    className="input" 
                    type="password" 
                    value={form.password} 
                    onChange={e => update("password", e.target.value)} 
                    placeholder="Enter your password" 
                  />
                </div>
                {error && <div className="alert alert-error">{error}</div>}
                <button className="btn btn-primary btn-lg" style={{ width: "100%" }} disabled={loading}>
                  {loading ? <span className="spinner"></span> : "Sign In"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup}>
                {step === 1 ? (
                  <>
                    <div className="onboarding-step">Step 1 of 2</div>
                    <h3 style={{ marginBottom: 24, fontSize: 22 }}>Create your account</h3>
                    <div className="field">
                      <label className="label">Full Name</label>
                      <input className="input" value={form.name} onChange={e => update("name", e.target.value)} placeholder="John Smith" />
                    </div>
                    <div className="field">
                      <label className="label">Email</label>
                      <input className="input" type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@example.com" />
                    </div>
                    <div className="field">
                      <label className="label">Password</label>
                      <input className="input" type="password" value={form.password} onChange={e => update("password", e.target.value)} placeholder="Create a password" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="onboarding-step">Step 2 of 2</div>
                    <h3 style={{ marginBottom: 24, fontSize: 22 }}>Your business details</h3>
                    <div className="field">
                      <label className="label">Business Name</label>
                      <input className="input" value={form.business_name} onChange={e => update("business_name", e.target.value)} placeholder="Your Wedding Films" />
                    </div>
                    <BusinessProfileFields form={form} update={update} />
                  </>
                )}
                {error && <div className="alert alert-error">{error}</div>}
                <button className="btn btn-primary btn-lg" style={{ width: "100%" }} disabled={loading}>
                  {loading ? <span className="spinner"></span> : step === 1 ? "Continue" : "Create Account"}
                </button>
                {step === 2 && (
                  <button type="button" className="btn btn-ghost" style={{ width: "100%", marginTop: 12 }} onClick={() => setStep(1)}>
                    Back
                  </button>
                )}
              </form>
            )}

            <div className="divider-text">
              <span>or</span>
            </div>

            <button 
              className="btn btn-secondary" 
              style={{ width: "100%" }} 
              onClick={() => { setIsLogin(!isLogin); setStep(1); setError(""); }}
            >
              {isLogin ? "Create an Account" : "Sign In Instead"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
