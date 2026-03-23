"""
User Models — Pydantic schemas for user profiles and context.

📚 LEARNING:
    User context = a concise profile that gets injected into every AI prompt.
    This lets the AI personalize its responses instead of being generic.
"""

from pydantic import BaseModel, Field


class UserContext(BaseModel):
    """User profile context that shapes AI responses."""
    interests: list[str] = Field(default_factory=list, description="User's areas of interest")
    role: str = Field(default="", description="User's role (e.g., 'CS student', 'frontend dev')")
    style: str = Field(default="concise", description="Preferred response style: concise | detailed | casual")
    goals: str = Field(default="", description="What the user is working toward")

    def to_prompt(self) -> str:
        """Convert profile to a prompt-injectable string."""
        parts = []
        if self.role:
            parts.append(f"Role: {self.role}")
        if self.interests:
            parts.append(f"Interests: {', '.join(self.interests)}")
        if self.goals:
            parts.append(f"Current goals: {self.goals}")
        if self.style:
            parts.append(f"Response style: {self.style}")
        return "; ".join(parts) if parts else ""


class UserContextUpdate(BaseModel):
    """Request body for updating user context."""
    interests: list[str] | None = None
    role: str | None = None
    style: str | None = None
    goals: str | None = None
