"""
MCP Tool Router — Model Context Protocol for tool calling.

📚 LEARNING:
    MCP is a pattern where the AI decides WHICH TOOL to use based on the
    user's intent. Instead of one big "do everything" function, you register
    small, focused tools, and the LLM picks the right one.

    Example:
        User: "Summarize this"      → AI picks `summarize` tool
        User: "Find my React notes" → AI picks `search` tool
        User: "Tag this article"    → AI picks `auto_tag` tool

    This is how ChatGPT plugins and function calling work!
"""

from typing import Callable, Any
from app.services.llm import llm_service


class Tool:
    """Represents a single callable tool."""

    def __init__(self, name: str, description: str, handler: Callable):
        self.name = name
        self.description = description
        self.handler = handler


class MCPRouter:
    """Routes user intent to the appropriate tool."""

    def __init__(self):
        self.tools: dict[str, Tool] = {}

    def register(self, name: str, description: str):
        """
        Decorator to register a tool.

        📚 LEARNING:
            Usage:
                @mcp.register("summarize", "Summarize content")
                async def summarize_handler(message, **kwargs):
                    ...

            The decorator adds the function to the tools dict
            without changing the function itself.
        """
        def decorator(func: Callable):
            self.tools[name] = Tool(name, description, func)
            return func
        return decorator

    async def detect_intent(self, message: str) -> str:
        """
        Use the LLM to detect which tool should handle this message.

        📚 LEARNING:
            Instead of hardcoding keyword matching, we ask the LLM
            to pick the right tool. This is more flexible and handles
            natural language variations better.
        """
        tool_descriptions = "\n".join(
            f"- {name}: {tool.description}"
            for name, tool in self.tools.items()
        )

        prompt = f"""Given these available tools:
{tool_descriptions}

User message: "{message}"

Which tool should be used? Reply with ONLY the tool name, nothing else."""

        response = await llm_service.generate(
            prompt, temperature=0.1, max_tokens=50,
        )

        tool_name = response.strip().lower().replace('"', "").replace("'", "")
        if tool_name in self.tools:
            return tool_name
        return "query"  # Default fallback

    async def route(self, message: str, **kwargs) -> dict:
        """Detect intent and route to the right tool."""
        tool_name = await self.detect_intent(message)
        tool = self.tools.get(tool_name)

        if not tool:
            return {"error": f"Unknown tool: {tool_name}", "tool_used": tool_name}

        result = await tool.handler(message=message, **kwargs)
        return {"tool_used": tool_name, "result": result}


# ── Global Router Instance ─────────────────────────────────────
mcp = MCPRouter()
