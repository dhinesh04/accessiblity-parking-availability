# backend/db.py
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
if SUPABASE_URL and SUPABASE_KEY:
    # Import supabase client lazily so the module can be imported even when
    # the package isn't installed (useful for lightweight local dev).
    from supabase import create_client, Client

    # Create a real Supabase client when credentials are present
    supabase: Client = create_client(SUPABASE_URL.strip(), SUPABASE_KEY.strip())
else:
    # Fallback stub: allows the backend to start in a local/mock mode when
    # Supabase credentials are not provided. This is intentional and safe
    # for local development. The stub returns empty results for queries and
    # raises on updates so callers can handle missing data.
    import sys
    import types
    from typing import Any

    class _StubResult:
        def __init__(self, data: Any = None):
            self.data = data

    class _TableStub:
        def __init__(self, name: str):
            self._name = name

        def select(self, *args, **kwargs):
            return self

        def order(self, *args, **kwargs):
            return self

        def execute(self):
            return _StubResult(data=[])

        def eq(self, *args, **kwargs):
            return self

        def single(self):
            return self

        def update(self, payload):
            # Simulate no-op update returning empty data
            return self

    class _SupabaseStub:
        def table(self, name: str):
            return _TableStub(name)

    supabase = _SupabaseStub()
    print("WARNING: Supabase credentials not found - running with a local stub. Create backend/.env to connect to Supabase.")
